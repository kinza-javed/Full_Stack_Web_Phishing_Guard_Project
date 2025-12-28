import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Link, Mail } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

const HeroSection = ({ onScan }) => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState('url'); // 'url' or 'email'

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsScanning(true);
    
    // Simulate API call
    setTimeout(() => {
      onScan(url, scanMode);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Phishing Guard
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Scan and analyze any {scanMode === 'url' ? 'URL' : 'email'} for safety, security, and detailed information
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-8 shadow-glow-lg hover:shadow-glow transition-all duration-300 border-indigo-500/20">
            <form onSubmit={handleScan} className="space-y-6">
              {/* Toggle between URL and Email scan */}
              <div className="flex justify-center mb-4">
                <div className="inline-flex rounded-full p-1 bg-white/10 dark:bg-dark-card/60 border border-white/20 dark:border-dark-border backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => { setScanMode('url'); setUrl(''); }}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center space-x-2 ${
                      scanMode === 'url'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_8px_20px_rgba(99,102,241,0.3)]'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Link className="w-4 h-4" />
                    <span>Scan URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setScanMode('email'); setUrl(''); }}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center space-x-2 ${
                      scanMode === 'email'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_8px_20px_rgba(99,102,241,0.3)]'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Scan Email</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  {scanMode === 'url' ? <Link className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                </div>
                <Input
                  type={scanMode === 'url' ? 'url' : 'email'}
                  placeholder={scanMode === 'url' ? 'Enter URL to scan (e.g., https://example.com)' : 'Enter email address to scan (e.g., user@example.com)'}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-12 h-14 text-lg"
                  disabled={isScanning}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg font-semibold"
                disabled={isScanning || !url.trim()}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Scan {scanMode === 'url' ? 'Link' : 'Email'}
                  </>
                )}
              </Button>
            </form>

            <motion.div 
              className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Fast Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span>SSL Verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Threat Detection</span>
              </div>
            </motion.div>
          </Card>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
      </div>
    </section>
  );
};

export default HeroSection;
