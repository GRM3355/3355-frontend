import express from "express";
import dotenv from "dotenv";
import { client } from "../index.js";

dotenv.config({ path: ".env.local" });

const router = express.Router();

router.get("/", async (_, res) => {
  try {
    await client.connect();
    const db = client.db("userDB");
    const collection = db.collection("tempUsers");

    // 새 유저 생성
    const result = await collection.insertOne({
      createdAt: new Date(),
    });

    const newUserId = result.insertedId.toString();

    res.status(200).json({
      message: "새 유저 생성 성공",
      userId: newUserId,
    });
  } catch (error) {
    console.error("유저 생성 실패:", error);
    res.status(500).json({
      message: "유저 생성 실패",
      error: error.message,
    });
  }
});


export default router;