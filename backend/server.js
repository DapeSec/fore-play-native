const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String }
});

const availabilitySchema = new mongoose.Schema({
  date: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', userSchema);
const Availability = mongoose.model('Availability', availabilitySchema);

const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ message: 'User registered successfully', token, userId: user._id });
  } catch (error) {
    console.log('Registration error:', error);
    res.status(400).json({ error: 'User registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = generateToken(user);
    res.json({ message: 'Login successful', token, userId: user._id });
  } catch (error) {
    console.log('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
  const { userId } = req.body;
  const profilePicturePath = req.file.path;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the photo already exists
    const existingPhoto = user.profilePicture;
    if (existingPhoto && fs.existsSync(existingPhoto)) {
      if (existingPhoto === profilePicturePath) {
        return res.status(400).json({ error: 'This photo already exists. Please upload a different photo.' });
      }
      // Remove the old photo
      fs.unlinkSync(existingPhoto);
    }

    user.profilePicture = profilePicturePath;
    await user.save();
    res.json({ message: 'Profile picture uploaded successfully', profilePicture: profilePicturePath });
  } catch (error) {
    console.log('Profile picture upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/reset-password', async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.log('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      username: user.username,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.log('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/select-date', async (req, res) => {
  const { userId, date, availability } = req.body;

  try {
    let dateEntry = await Availability.findOne({ date });

    if (!dateEntry) {
      dateEntry = new Availability({ date, users: [] });
    }

    if (availability.length === 0) {
      dateEntry.users = dateEntry.users.filter(user => user.toString() !== userId);
    } else {
      if (!dateEntry.users.some(user => user.toString() === userId)) {
        dateEntry.users.push(userId);
      }
    }

    await dateEntry.save();

    res.json({ message: 'Date selection updated successfully' });
  } catch (error) {
    console.log('Date selection update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/get-availability', async (req, res) => {
  try {
    const availability = await Availability.find().populate('users', 'profilePicture');
    const formattedAvailability = availability.map(dateEntry => ({
      date: dateEntry.date,
      users: dateEntry.users.map(user => ({ _id: user._id, profilePicture: user.profilePicture }))
    }));
    res.json(formattedAvailability);
  } catch (error) {
    console.log('Availability fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
