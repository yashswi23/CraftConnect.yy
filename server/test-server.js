// Minimal server test
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Minimal server working!');
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working!' });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
});