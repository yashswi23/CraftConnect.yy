// server/server.js
import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/api/users.js';
import bookingRoutes from './routes/api/bookings.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Backend server chal raha hai!');
});
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server port ${PORT} par shuru ho gaya hai.`);
});