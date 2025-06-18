const express = require('express');
const cors = require('cors'); // ✅ Import CORS
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

const app = express();


app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', require('./routes/chatRoutes'));

app.get('/', (req, res) => res.send('Auth API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
