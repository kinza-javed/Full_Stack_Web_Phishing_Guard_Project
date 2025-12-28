import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, MapPin, Phone, Clock, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'kinzajaved@phishingguard.pk',
      description: 'Get a response within 24 hours',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+92 321 1234567',
      description: 'Mon-Fri from 9am to 6pm PKT',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: 'Lahore, Pakistan',
      description: 'Gulberg III, Main Boulevard',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon - Fri: 9am - 6pm',
      description: 'Weekend support via email',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  const faqs = [
    {
      question: 'How fast are your response times?',
      answer: 'We typically respond to all inquiries within 24 hours during business days.',
    },
    {
      question: 'Do you offer phone support?',
      answer: 'Yes! Phone support is available for Pro and Enterprise plan subscribers.',
    },
    {
      question: 'Can I schedule a demo?',
      answer: 'Absolutely! Contact us to schedule a personalized demo of our platform.',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {contactInfo.map((info, index) => (
            <Card key={index} className="hover:border-indigo-500/50 transition-all duration-300 hover:shadow-glow">
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${info.color} mb-4`}>
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">{info.title}</h3>
                <p className="text-indigo-400 font-semibold mb-1">{info.value}</p>
                <p className="text-sm text-gray-500">{info.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-indigo-500/30 h-full">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-6 h-6 text-indigo-400" />
                  <CardTitle>Send us a Message</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="inline-flex p-4 rounded-full bg-green-500/10 mb-4">
                      <CheckCircle className="w-12 h-12 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-100 mb-2">Message Sent!</h3>
                    <p className="text-gray-400">We'll get back to you as soon as possible.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Name
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Kinza Javed"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="kinzajaved@gmail.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Subject
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        required
                        className="flex w-full rounded-xl border border-dark-border bg-dark-card px-4 py-3 text-base text-gray-100 placeholder:text-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full font-semibold">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="border-purple-500/30">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="pb-6 border-b border-dark-border last:border-0 last:pb-0">
                    <h4 className="text-lg font-semibold text-gray-100 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Office Hours Card */}
            <Card className="border-indigo-500/30 bg-gradient-to-br from-white to-gray-100 dark:from-dark-card dark:to-dark-hover">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-100 mb-4">
                  We're Here to Help
                </h3>
                <p className="text-gray-400 mb-4">
                  Our support team is available during business hours and we strive to respond to all inquiries promptly.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Average response time: 2-4 hours</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    <span>24/7 emergency support for Enterprise</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Map Section (Decorative) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="border-indigo-500/20 overflow-hidden">
            <div className="h-64 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 relative flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-100 mb-2">Visit Our Office</h3>
                <p className="text-gray-400">123 Security Street, Suite 100</p>
                <p className="text-gray-400">San Francisco, CA 94102</p>
              </div>
              {/* Decorative circles */}
              <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
