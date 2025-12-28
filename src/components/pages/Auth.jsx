import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { LogIn, UserPlus, Moon, Sun, ArrowLeft } from 'lucide-react';

const Auth = ({ onSkip = () => {}, onLogin = () => {} }) => {
  const [mode, setMode] = useState('login');
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [showReset, setShowReset] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (mode === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (mode === 'signup') {
      // Store user credentials
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.find(u => u.email === formData.email);
      
      if (userExists) {
        setErrors({ email: 'Email already registered' });
        return;
      }
      
      users.push({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      localStorage.setItem('users', JSON.stringify(users));
      showToast('Account created successfully! Please login.', 'success');
      
      // Switch to login mode instead of logging in directly
      setTimeout(() => {
        setMode('login');
        setFormData({ name: '', email: formData.email, password: '', confirmPassword: '' });
      }, 1500);
    } else {
      // Login
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      
      if (!user) {
        setErrors({ email: 'Invalid email or password' });
        return;
      }
      
      localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
      onLogin(user.name, user.email);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleForgotPassword = async () => {
    if (!resetEmail || !validateEmail(resetEmail)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    // Check if account exists (case-insensitive)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.find(u => u.email.toLowerCase() === resetEmail.toLowerCase());
    
    if (!userExists) {
      showToast('No account found with this email', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (!otpSent) {
          setOtpSent(true);
        }
        setResendTimer(30);
        
        showToast('OTP sent to your email!', 'success');
        
        if (data.otp) {
          console.log('📧 Your OTP Code:', data.otp);
        }
        
        if (data.previewUrl) {
          console.log('📧 Email Preview:', data.previewUrl);
        }
      } else {
        showToast(data.error || 'Failed to send OTP', 'error');
      }
    } catch (error) {
      console.error('OTP send error:', error);
      showToast('Failed to send OTP. Please check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (code) => {
    const otpToVerify = code || resetCode;
    if (otpToVerify.length !== 6) {
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp: otpToVerify })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOtpVerified(true);
        showToast('OTP verified! Enter new password', 'success');
      } else {
        showToast('Invalid OTP', 'error');
        setResetCode('');
      }
    } catch (error) {
      console.error('OTP verify error:', error);
      showToast('Failed to verify OTP', 'error');
    }
  };

  const handleResetPassword = () => {
    if (!newPassword || newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    // Update password in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === resetEmail);
    
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      
      showToast('Password reset successful!', 'success');
      setTimeout(() => {
        setShowReset(false);
        setResetCode('');
        setResetEmail('');
        setOtpSent(false);
        setOtpVerified(false);
        setNewPassword('');
        setConfirmNewPassword('');
      }, 1000);
    }
  };

  const handleOTPInput = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = resetCode.split('');
    newCode[index] = value;
    const updatedCode = newCode.join('');
    setResetCode(updatedCode);
    
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
    
    // Auto-verify when 6 digits entered
    if (updatedCode.length === 6) {
      handleVerifyOTP(updatedCode);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-glow-lg bg-white dark:bg-dark-card">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-400 font-semibold">Phishing Guard</p>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
                  <p className="text-gray-600 dark:text-gray-400">Securely scan, report, and track links.</p>
                </div>
                <button
                  onClick={() => setIsDark((v) => !v)}
                  className="p-3 rounded-xl border border-dark-border bg-white dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-700 dark:text-gray-200 transition-all"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
                </button>
              </div>

              <div className="flex space-x-2 bg-white/90 dark:bg-dark-card/60 rounded-xl p-1 border border-dark-border">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                    mode === 'login'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_10px_30px_rgba(99,102,241,0.35)]'
                      : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                    mode === 'signup'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_10px_30px_rgba(99,102,241,0.35)]'
                      : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                  }`}
                >
                  Signup
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <Input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full name" 
                      className="h-12" 
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                )}
                <div>
                  <Input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address" 
                    className="h-12" 
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password (min 8 characters)" 
                    className="h-12" 
                  />
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>
                {mode === 'signup' && (
                  <div>
                    <Input 
                      type="password" 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password" 
                      className="h-12" 
                    />
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                )}

              <div className="flex items-center justify-between text-sm text-indigo-500 dark:text-indigo-300">
                {mode === 'login' && (
                  <button type="button" onClick={() => { setShowReset(true); }} className="hover:text-indigo-700 dark:hover:text-white">Forgot password?</button>
                )}
                <button type="button" onClick={onSkip} className={`flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white ${mode === 'signup' ? 'ml-auto' : ''}`}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Skip for now</span>
                </button>
              </div>

              <Button type="submit" className="w-full h-12 text-lg">
                {mode === 'login' ? (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Login
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/30 shadow-glow dark:from-indigo-500/15 dark:via-purple-500/10 dark:to-pink-500/15">
            <CardContent className="p-8 space-y-5">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Stay protected</h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li>• Real-time phishing and malware detection</li>
                <li>• SSL, DNS, and WHOIS insights in one scan</li>
                <li>• Save your scan history for quick recall</li>
              </ul>
              <div className="pt-2 text-sm text-gray-600 dark:text-gray-400">
                Toggle light/dark anytime—your preference is saved.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      {/* Reset modal */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => { 
            setShowReset(false); 
            setResetEmail(''); 
            setResetCode(''); 
            setOtpSent(false); 
            setOtpVerified(false);
            setNewPassword('');
            setConfirmNewPassword('');
          }}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-white/95 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95 border-2 border-white/50 dark:border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none"></div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {!otpSent ? 'Reset Password' : otpVerified ? 'New Password' : 'Verify OTP'}
                  </h3>
                  <button
                    onClick={() => { 
                      setShowReset(false); 
                      setResetEmail(''); 
                      setResetCode(''); 
                      setOtpSent(false); 
                      setOtpVerified(false);
                      setNewPassword('');
                      setConfirmNewPassword('');
                    }}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {!otpSent ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">We'll verify your account and send an OTP to your email</p>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleForgotPassword()}
                      className="mb-6 h-12"
                    />
                    <button
                      onClick={handleForgotPassword}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          Sending OTP...
                        </>
                      ) : 'Send OTP'}
                    </button>
                  </>
                ) : !otpVerified ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Enter the code sent to</p>
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-6">{resetEmail}</p>
                    
                    <div className="flex gap-3 justify-center mb-6">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <input
                          key={i}
                          id={`otp-${i}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          className="w-12 h-14 text-center text-2xl font-bold bg-white/60 dark:bg-gray-800/60 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:outline-none text-gray-900 dark:text-white transition-all"
                          value={resetCode[i] || ''}
                          onChange={(e) => handleOTPInput(i, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !resetCode[i] && i > 0) {
                              document.getElementById(`otp-${i - 1}`)?.focus();
                            }
                          }}
                        />
                      ))}
                    </div>
                    
                    <div className="text-center mb-6">
                      {resendTimer > 0 ? (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Resend available in {resendTimer}s
                        </p>
                      ) : (
                        <button
                          onClick={() => {
                            setResetCode('');
                            handleForgotPassword();
                          }}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Create a strong password (minimum 8 characters)</p>
                    <Input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mb-4 h-12"
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                      className="mb-6 h-12"
                    />
                    <button
                      onClick={handleResetPassword}
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center"
                    >
                      Reset Password
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {/* Toast Notification */}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-[100] max-w-md"
        >
          <div className={`px-6 py-4 rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl border ${
            toast.type === 'success'
              ? 'bg-green-500/90 border-green-400/50 text-white'
              : 'bg-red-500/90 border-red-400/50 text-white'
          }`}>
            <div className="flex items-center space-x-3">
              {toast.type === 'success' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <p className="font-semibold">{toast.message}</p>
            </div>
          </div>
        </motion.div>
      )}    </div>
  );
};

export default Auth;

