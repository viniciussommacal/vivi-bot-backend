import express from 'express';
import dotenv from 'dotenv';
import HealthRoute from './routes/HealthRoute';
import ChatRoute from './routes/ChatRoute';
import cors from 'cors';

dotenv.config();
const APP_PORT = process.env.APP_PORT;

const app = express();
app.use(cors());
app.use(express.json());

app.use(ChatRoute);
app.use(HealthRoute);

app.listen(APP_PORT, () => {
  console.log(`Server running at http://localhost:${APP_PORT}`);
});
