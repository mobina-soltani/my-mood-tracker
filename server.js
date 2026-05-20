import express from 'express';
import cors from 'cors';
import { JSONFilePreset } from 'lowdb/node';

const app = express();
app.use(cors());
app.use(express.json());

// This creates your 'db.json' file automatically
const defaultData = { logs: [] };
const db = await JSONFilePreset('db.json', defaultData);

// The "Save" instruction
app.post('/api/save', async (req, res) => {
  await db.update(({ logs }) => logs.push(req.body));
  console.log("New log saved to db.json!");
  res.send({ status: 'success' });
});

// The "Read" instruction
app.get('/api/logs', (req, res) => {
  res.send(db.data.logs);
});

app.listen(3001, () => console.log('Data server ready at http://localhost:3001'));