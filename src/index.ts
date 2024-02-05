// src/index.js
import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({msg: "Express and TypeScript starter!"});
});

app.listen(port, () => {
  console.log(`[server]: Node Server is running at http://localhost:${port}`);
});
