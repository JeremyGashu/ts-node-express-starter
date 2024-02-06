// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { stream } from './logger/logger';
import 'dotenv/config';
import { initAllAppRoutes } from './router';
import { rateLimitMiddleware } from './middleware/ratelimit';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(rateLimitMiddleware);
app.use(morgan('combined', { stream: stream }));
initAllAppRoutes(app);
// app.get("/", (_req: Request, res: Response) => {
//   res.status(200).json({msg: "Express and TypeScript starter!"});
// });

app.listen(port, () => {
  console.log(`[server]: Node Server is running at http://localhost:${port}`);
});
