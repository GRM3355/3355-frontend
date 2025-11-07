import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import festivalRouter from "./routes/festival.js";

//.env.local 파일 사용하려면 path 지정필요
dotenv.config({ path: ".env.local" });

const app = express();
app.use(cors()); //CORS 막힘 방지

const uri = process.env.MONGODB_URI;
export const client = new MongoClient(uri);

app.use("/api/festival", festivalRouter);

app.get("/api/user", async (_, res) => {
  try {
    await client.connect();
    const db = client.db("user");
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

app.listen(3000, () => console.log("서버 실행됨: http://localhost:3000"));
