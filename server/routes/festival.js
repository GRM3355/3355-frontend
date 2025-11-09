import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { client } from "../index.js";

dotenv.config({ path: ".env.local" });

const router = express.Router();
const API_KEY = process.env.PUBLIC_API_KEY;

router.get("/sync", async (_, res) => {
  try {
    await client.connect();
    const db = client.db("festivalDB");
    const collection = db.collection("festivals");

    const response = await axios.get(
      "http://apis.data.go.kr/B551011/KorService2/searchFestival2",
      {
        params: {
          serviceKey: API_KEY,
          _type: "json",
          numOfRows: 200,
          pageNo: 1,
          MobileApp: "AppTest",
          MobileOS: "ETC",
          eventStartDate: "20251101",
        },
      }
    );
    const items = response.data?.response?.body?.items?.item ?? [];

    const festivals = items.map((item) => ({
      id: String(item.contentid),
      name: item.title ?? "",
      longitude: parseFloat(item.mapx ?? 0),
      latitude: parseFloat(item.mapy ?? 0),
      mainImage: item.firstimage ?? "",
      date: item.eventstartdate
        ? `${item.eventstartdate} ~ ${item.eventenddate}`
        : "",
      address: item.addr1 ?? "",
      category: item.cat3 ?? "",
      region: item.areacode ?? "",
    }));

    if (festivals.length === 0) {
      return res.json({ message: "데이터 없음" });
    }

    for (const festival of festivals) {
      await collection.updateOne(
        { id: festival.id },
        { $set: festival }, //있으면 업데이트 
        { upsert: true } //없으면 새로 넣기
      );
    }

    res.json({ message: "DB 저장 완료", count: festivals.length });
  } catch (error) {
    console.error("DB 저장 실패:", error);
    res.status(500).json({ error: error.message });
  }
});

// api/festival/list
router.get("/list", async (_, res) => {
  try {
    await client.connect();
    const db = client.db("festivalDB");
    const collection = db.collection("festivals");

    const festivals = await collection.find({}).limit(50).toArray();

    res.status(200).json({
      message: "축제 목록 가져오기 성공",
      data: festivals,
    });
  } catch (error) {
    console.error("축제 목록 조회 실패:", error);
    res.status(500).json({ message: "DB 조회 실패", error: error.message });
  }
});


router.get("/:id/rooms", async (req, res) => {
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

// api/festival/:id
router.get("/:id", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("festivalDB");
    const collection = db.collection("festivals");

    const festival = await collection.findOne({ id: req.params.id });

    if (!festival)
      return res.status(404).json({ message: "해당 축제를 찾을 수 없습니다." });

    res.status(200).json({
      message: "축제 상세 조회 성공",
      data: festival,
    });
  } catch (error) {
    console.error("축제 상세 조회 실패:", error);
    res.status(500).json({ message: "DB 조회 실패", error: error.message });
  }
});



export default router;
