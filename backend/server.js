const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import Models
const Hospital = require('./models/Hospital');
const Doctor = require('./models/Doctor');
const Lab = require('./models/Lab');
const LabTest = require('./models/LabTest');
const Pharmacy = require('./models/Pharmacy');
const DonationOrg = require('./models/DonationOrg');
const Appointment = require('./models/Appointment');
const TestBooking = require('./models/TestBooking');
const MedicineOrder = require('./models/MedicineOrder');
const OrganPledge = require('./models/OrganPledge');
const User = require('./models/User');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/health';
const JWT_SECRET = process.env.JWT_SECRET || 'healthpath_super_secret_key_2024';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB — health database'))
  .catch(err => console.error('MongoDB connection error:', err));

// ==========================================
// AUTH Endpoints
// ==========================================

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/me — verify token and return user
app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// ==========================================
// GET Endpoints (Public — Fetching Data)
// ==========================================

app.get('/api/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/doctors', async (req, res) => {
  try {
    const { hospitalId, speciality } = req.query;
    let query = {};
    if (hospitalId) query.hospitalId = hospitalId;
    if (speciality) query.speciality = speciality;
    const doctors = await Doctor.find(query);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/labs', async (req, res) => {
  try {
    const labs = await Lab.find();
    res.json(labs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/lab-tests', async (req, res) => {
  try {
    const tests = await LabTest.find();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pharmacies', async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find();
    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/donation-orgs', async (req, res) => {
  try {
    const orgs = await DonationOrg.find();
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// POST Endpoints (Protected — Require Login)
// ==========================================

// 1. Get my appointments
app.get('/api/appointments/my', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Book Appointment
app.post('/api/appointments', authMiddleware, async (req, res) => {
  try {
    const { doctorId, slot, doctorName, speciality, hospitalName } = req.body;
    const bookingId = `BK-${Math.floor(Math.random() * 100000)}`;
    const newAppointment = new Appointment({
      bookingId,
      userId: req.user.id,
      doctorId,
      doctorName: doctorName || 'Unknown Doctor',
      speciality: speciality || '',
      hospitalName: hospitalName || '',
      patientName: req.user.name,
      slot
    });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Schedule Test
app.post('/api/test-bookings', authMiddleware, async (req, res) => {
  try {
    const { labId, tests, visitType, totalAmount } = req.body;
    const bookingId = `LAB-${Math.floor(Math.random() * 100000)}`;
    const newBooking = new TestBooking({ bookingId, labId, tests, visitType, totalAmount });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Order Medicine
app.post('/api/medicine-orders', authMiddleware, async (req, res) => {
  try {
    const { pharmacyId, deliveryAddress, notes, prescriptionFile } = req.body;
    const orderId = `ORD-${Math.floor(Math.random() * 100000)}`;
    const newOrder = new MedicineOrder({ orderId, pharmacyId, deliveryAddress, notes, prescriptionFile });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Organ Pledge
app.post('/api/organ-pledges', authMiddleware, async (req, res) => {
  try {
    const { orgId, name, email, phone, bloodGroup, pledgeType } = req.body;
    const pledgeId = `DON-${Math.floor(Math.random() * 100000)}`;
    const newPledge = new OrganPledge({ pledgeId, orgId, name, email, phone, bloodGroup, pledgeType });
    await newPledge.save();
    res.status(201).json(newPledge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const chatRouter = require('./routes/chat');

// AI Chat Endpoint
app.use('/api/chat', chatRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

