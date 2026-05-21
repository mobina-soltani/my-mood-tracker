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

// GET: Retrieve all mood logs from the database
app.get('/api/logs', async (req, res) => {
  try {
    await db.read(); // Refresh the data from the db.json file
    // Send the logs back to the frontend, or an empty array if none exist
    res.json(db.data.logs || []);
  } catch (error) {
    console.error("Failed to read logs:", error);
    res.status(500).json({ error: "Could not retrieve logs" });
  }
});

// The "Read" instruction
app.get('/api/logs', (req, res) => {
  res.send(db.data.logs);
});

app.listen(3001, () => console.log('Data server ready at http://localhost:3001'));