// MongoDB Backend Server
// Since this is a frontend app, you need a backend server to connect to MongoDB
// IMPORTANT: Never connect to MongoDB directly from the frontend (security risk)

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Create email transporter - will auto-configure on first use
let emailTransporter = null;

async function getEmailTransporter() {
  if (emailTransporter) return emailTransporter;
  
  // Check if Gmail credentials are provided in .env
  const useGmail = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD;
  
  if (useGmail) {
    // Use real Gmail
    console.log('📧 Using Gmail for email service...');
    console.log(`📧 Gmail User: ${process.env.GMAIL_USER}`);
    console.log(`📧 App Password: ${process.env.GMAIL_APP_PASSWORD ? '***configured***' : 'NOT SET'}`);
    
    emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
    
    // Verify the connection
    try {
      await emailTransporter.verify();
      console.log('✅ Gmail configured and verified successfully!');
    } catch (verifyError) {
      console.error('❌ Gmail verification failed:', verifyError.message);
      throw verifyError;
    }
  } else {
    // Use test account (Ethereal)
    console.log('📧 Setting up automatic TEST email service...');
    console.log('⚠️ OTPs will NOT be sent to real email addresses!');
    const testAccount = await nodemailer.createTestAccount();
    
    emailTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    console.log('✅ Test email service configured!');
    console.log(`📧 Preview emails at: https://ethereal.email`);
    console.log(`📧 Login: ${testAccount.user} / ${testAccount.pass}`);
  }
  
  return emailTransporter;
}

const app = express();
// const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kinzajaved934_db_user:kinzaj9023@cluster0.zddcj2u.mongodb.net/phishing_guard';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('⚠️ Server will continue running but database features will not work!');
    console.error('📝 Please check:');
    console.error('   1. Your IP address is whitelisted in MongoDB Atlas');
    console.error('   2. MongoDB Atlas cluster is running');
    console.error('   3. Connection string is correct');
  });

// Schemas
const ScanHistorySchema = new mongoose.Schema({
  userEmail: { type: String, default: 'guest' },
  userId: { type: String, required: true },
  domain: String,
  url: String,
  safety: String,
  ipAddress: String,
  location: {
    country: String,
    city: String,
    region: String
  },
  ssl: {
    valid: Boolean,
    issuer: String,
    expires: String
  },
  timestamp: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Should be hashed in production
  createdAt: { type: Date, default: Date.now }
});

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }
});

const ScanHistory = mongoose.model('ScanHistory', ScanHistorySchema);
const User = mongoose.model('User', UserSchema);
const Contact = mongoose.model('Contact', ContactSchema);

// Middleware to check MongoDB connection
function checkDatabaseConnection(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      success: false, 
      error: 'Database connection unavailable. Please check MongoDB connection.' 
    });
  }
  next();
}

// API Routes

// Save scan history (supports both guest and logged-in users)
app.post('/api/scans', checkDatabaseConnection, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.body.userId || 'guest';
    const userEmail = req.body.userEmail || 'guest';
    const scan = new ScanHistory({ ...req.body, userId, userEmail });
    await scan.save();
    res.status(201).json({ success: true, data: scan });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get scan history (user-specific)
app.get('/api/scans', checkDatabaseConnection, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User ID required' });
    }
    const scans = await ScanHistory.find({ userId }).sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, data: scans });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete scan from history (user-specific)
app.delete('/api/scans/:id', checkDatabaseConnection, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User ID required' });
    }
    // Ensure user can only delete their own scans
    const scan = await ScanHistory.findOne({ _id: req.params.id, userId });
    if (!scan) {
      return res.status(404).json({ success: false, error: 'Scan not found' });
    }
    await ScanHistory.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear all scans for a user
app.delete('/api/scans', checkDatabaseConnection, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User ID required' });
    }
    await ScanHistory.deleteMany({ userId });
    res.json({ success: true, message: 'All scans cleared' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User registration
app.post('/api/auth/register', checkDatabaseConnection, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
    
    const user = new User({ name, email, password }); // Hash password in production
    await user.save();
    res.status(201).json({ 
      success: true, 
      data: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// User login
app.post('/api/auth/login', checkDatabaseConnection, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password }); // Use proper password comparison in production

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password. Account not found.' });
    }

    res.json({ success: true, data: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Contact form submission
app.post('/api/contact', checkDatabaseConnection, async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Send OTP email
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 10 minute expiry
    otpStore.set(email, {
      otp,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });
    
    console.log(`\n🔐 OTP Generated for ${email}: ${otp}`);
    console.log(`⏰ Expires in 10 minutes\n`);
    
    try {
      // Get or create email transporter
      const transporter = await getEmailTransporter();
      
      // Send email
      const mailOptions = {
        from: '"Phishing Guard" <noreply@phishingguard.com>',
        to: email,
        subject: 'Phishing Guard - Password Reset OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1;">Password Reset Request</h2>
            <p>You requested to reset your password. Use the following OTP to complete the process:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="color: #1f2937; margin: 0; font-size: 32px; letter-spacing: 8px;">${otp}</h1>
            </div>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Phishing Guard - Email Security Scanner</p>
          </div>
        `
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent to ${email}`);
      console.log(`📧 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      
      res.json({ 
        success: true, 
        message: 'OTP sent successfully',
        previewUrl: nodemailer.getTestMessageUrl(info),
        otp: otp // For testing - remove in production
      });
    } catch (emailError) {
      console.error('⚠️ Email send failed, but OTP is still valid:', emailError.message);
      // Return success anyway since OTP is generated
      res.json({ 
        success: true, 
        message: `OTP generated (Check console): ${otp}`,
        otp: otp
      });
    }
  } catch (error) {
    console.error('❌ OTP send error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ success: false, error: 'Failed to send OTP. Check server logs.' });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const stored = otpStore.get(email);
    
    if (!stored) {
      return res.status(400).json({ success: false, error: 'OTP not found or expired' });
    }
    
    if (Date.now() > stored.expires) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, error: 'OTP expired' });
    }
    
    if (stored.otp !== otp) {
      return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }
    
    // OTP verified, remove from store
    otpStore.delete(email);
    
    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ success: false, error: 'Failed to verify OTP' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;
