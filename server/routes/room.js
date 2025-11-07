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
