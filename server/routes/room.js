import express from "express";
import dotenv from "dotenv";
import { client } from "../index.js";
import { ObjectId } from "mongodb";

dotenv.config({ path: ".env.local" });

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("roomDB");
    const collection = db.collection("rooms");

    const rooms = await collection
      .find({ festival_id: req.params.id })
      .toArray();

    res.status(200).json({
      message: "방 조회 성공",
      data: rooms,
    });
  } catch (error) {
    console.error("방 조회 실패:", error);
    res.status(500).json({ message: "DB 조회 실패", error: error.message });
  }
});

// 새 방 생성
router.post("/", async (req, res) => {
  try {
    await client.connect();
    const roomDB = client.db("roomDB");
    const roomCollection = roomDB.collection("rooms"); //룸 업데이트

    const userDB = client.db("userDB");
    const userCollection = userDB.collection("tempUsers"); //유저의 참여방 목록 업데이트

    const { userId, festivalId, title } = req.body;

    // 기본 유효성 검사
    if (!userId || !festivalId || !title) {
      return res
        .status(400)
        .json({ message: "userId, festivalId, title 모두 필요합니다." });
    }

    const newRoom = {
      festival_id: festivalId,  // 어떤 축제의 방인지
      host_id: userId,          // 방 생성자
      title,                    // 방 제목
      current_members: 1,       // 현재 인원 (생성자 1명 포함)
      max_members: 30,          // 선택: 최대 인원 (원하면 클라이언트에서 받도록 변경 가능)
      created_at: new Date(),
    };

    const result = await roomCollection.insertOne(newRoom);

    //유저 방 목록 업데이트
    //TODO: 유저 아이디 없으면 강제로 추가되게 해놓음. 이러면 로그인 없이 방 생성으로 가입이 되는거라 추후 수정 필요
    await userCollection.updateOne(
      { userId }, // userId로 검색
      {
        $push: { joined_rooms: result.insertedId },        // 배열에 방 ID 추가
        $setOnInsert: { userId }                           // 문서 없으면 userId 필드 포함
      },
      { upsert: true }
    );

    res.status(201).json({
      message: "방 생성 성공",
      data: {
        _id: result.insertedId,
        ...newRoom,
      },
    });
  } catch (error) {
    console.error("방 생성 실패:", error);
    res.status(500).json({ message: "DB 저장 실패", error: error.message });
  }
});

// 유저 아이디로 참여 중인 방 목록 조회
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    await client.connect();
    const roomDB = client.db("roomDB");
    const roomCollection = roomDB.collection("rooms");

    const userDB = client.db("userDB");
    const userCollection = userDB.collection("tempUsers");

    const user = await userCollection.findOne({ userId });

    // 유저가 참여한 방이 없으면 빈 배열 반환
    if (!user || !user.joined_rooms?.length) {
      return res.status(200).json({
        message: "유저가 참여한 방이 없습니다",
        data: [],
      });
    }

    // user_id가 일치하는 방 모두 조회
    const rooms = await roomCollection
      .find({ _id: { $in: user.joined_rooms.map(id => new ObjectId(id)) } })
      .toArray();

    res.status(200).json({
      message: "유저의 방 목록 조회 성공",
      data: rooms,
    });
  } catch (error) {
    console.error("유저의 방 조회 실패:", error);
    res.status(500).json({
      message: "DB 조회 실패",
      error: error.message,
    });
  }
});

export default router;
