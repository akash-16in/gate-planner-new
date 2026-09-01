require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json()); 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/gate2026_final.html');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const DaySchema = new mongoose.Schema({
  dateKey: { type: String, required: true, unique: true }, 
  subjects: [{ n: String, h: String }],
  distractions: [{ n: String, h: String }],
  note: { type: String, default: '' },
  mood: { type: Number, default: -1 },
  test: { category: String, name: String, score: String }
});
const Day = mongoose.model('Day', DaySchema);

app.get('/api/days', async (req, res) => {
  try {
    const days = await Day.find();
    const map = {};
    days.forEach(d => map[d.dateKey] = d);
    res.json(map);
  } catch (error) { res.status(500).json({ error: 'Error loading' }); }
});

app.post('/api/days/:dateKey', async (req, res) => {
  try {
    await Day.findOneAndUpdate({ dateKey: req.params.dateKey }, req.body, { upsert: true });
    res.json({ message: 'Saved' });
  } catch (error) { res.status(500).json({ error: 'Error saving' }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});