// /api/new-meetup
import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const data = req.body;

      console.log(process.env.DB_URL);
      const client = await MongoClient.connect(process.env.DB_URL);
      const db = client.db();
      const collection = db.collection("meetups");
      const result = await collection.insertOne(data);
  
      console.log(result);
  
      client.close();
  
      res.status(201).json({message: "meetup created"});
    } catch (error) {
      console.error(error);
    }
  }
}