const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');                         // for crypto.randomUUID()
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// ── Guard: JWT_SECRET must be in environment ─────────────────────────────────
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Exiting.');
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;
// ─────────────────────────────────────────────────────────────────────────────

// Import Models
const Hospital    = require('./models/Hospital');
const Doctor      = require('./models/Doctor');
const Lab         = require('./models/Lab');
const LabTest     = require('./models/LabTest');
const Pharmacy    = require('./models/Pharmacy');
const DonationOrg = require('./models/DonationOrg');
const Appointment = require('./models/Appointment');
const TestBooking = require('./models/TestBooking');
const MedicineOrder = require('./models/MedicineOrder');
const OrganPledge = require('./models/OrganPledge');
const User        = require('./models/User');
const authMiddleware = require('./middleware/auth');

const app  = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/health';

app.use(cors());
app.use(express.json());

// ── Connect to MongoDB ────────────────────────────────────────────────────────
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB — health database'))
  .catch(err => console.error('MongoDB connection error:', err));

// ── Helper: return first validation error as 400 ─────────────────────────────
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return only the first error message for clarity
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  return null;
};

// ==========================================
// Rate Limiters
// ==========================================

// Auth routes: 10 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests. Please wait 15 minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==========================================
// AUTH Endpoints
// ==========================================

// POST /api/auth/register
app.post(
  '/api/auth/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const err = validate(req, res);
    if (err) return err;

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
  }
);

// POST /api/auth/login
app.post(
  '/api/auth/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const err = validate(req, res);
    if (err) return err;

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
  }
);

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
    if (speciality)  query.speciality = speciality;
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
app.get(['/api/appointments', '/api/appointments/my'], authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Book Appointment
app.post(
  '/api/appointments',
  authMiddleware,
  [
    body('doctorId').notEmpty().withMessage('doctorId is required'),
    body('date').notEmpty().withMessage('date is required'),
    body('slot').notEmpty().withMessage('slot is required'),
  ],
  async (req, res) => {
    const err = validate(req, res);
    if (err) return err;

    try {
      const { doctorId, date, slot, doctorName, speciality, hospitalName } = req.body;

      // Use crypto.randomUUID() instead of Math.random() for unique IDs
      const bookingId = `BK-${crypto.randomUUID().split('-')[0].toUpperCase()}`;

      const newAppointment = new Appointment({
        bookingId,
        userId: req.user.id,
        doctorId,
        doctorName: doctorName || 'Unknown Doctor',
        speciality: speciality || '',
        hospitalName: hospitalName || '',
        patientName: req.user.name,
        date,
        slot
      });

      await newAppointment.save();
      res.status(201).json(newAppointment);
    } catch (error) {
      // MongoDB duplicate-key error code 11000 → same doctor, date and slot already booked
      if (error.code === 11000) {
        return res.status(409).json({ error: 'Doctor already has an appointment booked for this date and time slot.' });
      }
      res.status(500).json({ error: error.message });
    }
  }
);

// 2b. Cancel Appointment (frees slot)
app.patch('/api/appointments/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const query = {
      $or: [
        ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : []),
        { bookingId: id }
      ],
      userId: req.user.id
    };
    const appointment = await Appointment.findOne(query);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    appointment.status = 'Cancelled';
    await appointment.save();
    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get my test bookings
app.get(['/api/test-bookings', '/api/test-bookings/my'], authMiddleware, async (req, res) => {
  try {
    const bookings = await TestBooking.find({
      $or: [{ userId: req.user.id }, { user: req.user.id }]
    }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Schedule Test (server recalculates totalAmount from DB prices)
app.post(
  '/api/test-bookings',
  authMiddleware,
  [
    body('labId').notEmpty().withMessage('labId is required'),
    body('tests').isArray({ min: 1 }).withMessage('tests must be a non-empty array'),
    body('visitType').notEmpty().withMessage('visitType is required'),
  ],
  async (req, res) => {
    const err = validate(req, res);
    if (err) return err;

    try {
      const { labId, tests, visitType } = req.body;

      // Recalculate totalAmount on the server — do NOT trust client's amount
      const labTestDocs = await LabTest.find({ originalId: { $in: tests } });
      const totalAmount = labTestDocs.reduce((sum, t) => sum + (t.price || 0), 0);

      const bookingId = `LAB-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
      const newBooking = new TestBooking({
        bookingId,
        userId: req.user.id,
        user: req.user.id,
        labId,
        tests,
        visitType,
        totalAmount
      });
      await newBooking.save();
      res.status(201).json(newBooking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// 5. Get my medicine orders
app.get(['/api/medicine-orders', '/api/medicine-orders/my'], authMiddleware, async (req, res) => {
  try {
    const orders = await MedicineOrder.find({
      $or: [{ userId: req.user.id }, { user: req.user.id }]
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Order Medicine
app.post(
  '/api/medicine-orders',
  authMiddleware,
  [
    body('pharmacyId').notEmpty().withMessage('pharmacyId is required'),
    body('deliveryAddress').notEmpty().withMessage('deliveryAddress is required'),
  ],
  async (req, res) => {
    const err = validate(req, res);
    if (err) return err;

    try {
      const { pharmacyId, deliveryAddress, notes, prescriptionFile } = req.body;
      const orderId = `ORD-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
      const newOrder = new MedicineOrder({
        orderId,
        userId: req.user.id,
        user: req.user.id,
        pharmacyId,
        deliveryAddress,
        notes,
        prescriptionFile
      });
      await newOrder.save();
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// 7. Organ Pledge
app.post(
  '/api/organ-pledges',
  authMiddleware,
  [
    body('orgId').notEmpty().withMessage('orgId is required'),
    body('name').notEmpty().withMessage('name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('phone is required'),
    body('bloodGroup').notEmpty().withMessage('bloodGroup is required'),
    body('pledgeType').notEmpty().withMessage('pledgeType is required'),
  ],
  async (req, res) => {
    const err = validate(req, res);
    if (err) return err;

    try {
      const { orgId, name, email, phone, bloodGroup, pledgeType } = req.body;
      const pledgeId = `DON-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
      const newPledge = new OrganPledge({ pledgeId, orgId, name, email, phone, bloodGroup, pledgeType });
      await newPledge.save();
      res.status(201).json(newPledge);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// AI Chat route (rate limiter is applied inside routes/chat.js)
const chatRouter = require('./routes/chat');
app.use('/api/chat', chatRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
