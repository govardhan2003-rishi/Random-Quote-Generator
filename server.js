const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'your_jwt_secret_here'; // Change this in production!

mongoose.connect('mongodb://127.0.0.1:27017/quoteapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// --- Schemas ---

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  favorites: [{ text: String, author: String }]
});

const User = mongoose.model('User', UserSchema);

// --- Middleware to verify JWT token ---

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// --- Routes ---

// Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Please provide username and password' });

  const existingUser = await User.findOne({ username });
  if (existingUser)
    return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ username, password: hashedPassword, favorites: [] });
  await user.save();

  res.json({ message: 'User registered successfully' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Please provide username and password' });

  const user = await User.findOne({ username });
  if (!user)
    return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, username: user.username });
});

// Get user favorites
app.get('/api/favorites', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user.favorites);
});

// Add quote to favorites
app.post('/api/favorites', authMiddleware, async (req, res) => {
  const { text, author } = req.body;
  if (!text) return res.status(400).json({ message: 'Quote text is required' });

  const user = await User.findById(req.userId);

  // Prevent duplicates
  if (user.favorites.find(q => q.text === text)) {
    return res.status(400).json({ message: 'Quote already in favorites' });
  }

  user.favorites.push({ text, author });
  await user.save();
  res.json(user.favorites);
});

// Remove quote from favorites
app.delete('/api/favorites', authMiddleware, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Quote text is required' });

  const user = await User.findById(req.userId);

  user.favorites = user.favorites.filter(q => q.text !== text);
  await user.save();
  res.json(user.favorites);
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));