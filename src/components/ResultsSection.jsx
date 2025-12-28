import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldAlert,
  ShieldQuestion,
  Globe,
  Lock,
  MapPin,
  Server,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Network,
  Zap,
  Award,
  Calendar,
  Camera,
  Database,
  Mail,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

const ResultsSection = ({ results }) => {
  if (!results) return null;

  const getSafetyIcon = (status) => {
    switch (status) {
      case 'Safe':
        return <Shield className="w-6 h-6 text-green-500" />;
      case 'Phishing':
        return <ShieldAlert className="w-6 h-6 text-red-500" />;
      default:
        return <ShieldQuestion className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getSafetyColor = (status) => {
    switch (status) {
      case 'Safe':
        return 'border-green-500/30 bg-green-500/5';
      case 'Phishing':
        return 'border-red-500/30 bg-red-500/5';
      default:
        return 'border-yellow-500/30 bg-yellow-500/5';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Scan Results
          </span>
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Safety Status Card */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <Card className={`${getSafetyColor(results.safety)} border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(99,102,241,0.4)]`}>
              <CardContent className="p-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-4 rounded-2xl bg-dark-bg">
                      {getSafetyIcon(results.safety)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-100">
                        {results.safety}
                      </h3>
                      <p className="text-gray-400 mt-1">Security Status</p>
                      {results.reputation && (
                        <p className="text-sm text-gray-500 mt-1">
                          Reputation: <span className="text-indigo-400">{results.reputation}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    {results.safety === 'Safe' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : results.safety === 'Phishing' ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className="text-gray-300">
                      {results.safety === 'Safe'
                        ? 'This link appears to be safe'
                        : results.safety === 'Phishing'
                        ? 'Warning: Potential threat detected'
                        : 'Unable to verify safety'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Screenshot Card */}
          {results.screenshot && results.screenshot.available && (
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <Card className="hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(168,85,247,0.4)]">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-purple-500/10">
                      <Camera className="w-5 h-5 text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">Website Preview</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative rounded-xl overflow-hidden border border-dark-border">
                    <img 
                      src={results.screenshot.url} 
                      alt="Website screenshot"
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Performance Card */}
          {results.performance && (
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <Card className="hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(234,179,8,0.4)]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-xl bg-yellow-500/10">
                        <Zap className="w-5 h-5 text-yellow-400" />
                      </div>
                      <CardTitle className="text-lg">Performance Score</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`text-3xl font-bold ${
                        results.performance.score >= 90 ? 'text-green-400' :
                        results.performance.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {results.performance.score}
                      </div>
                      <span className="text-gray-500">/100</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-dark-bg rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">First Contentful Paint</p>
                      <p className="text-xl font-semibold text-gray-100">{results.performance.fcp}</p>
                    </div>
                    <div className="text-center p-4 bg-dark-bg rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Largest Contentful Paint</p>
                      <p className="text-xl font-semibold text-gray-100">{results.performance.lcp}</p>
                    </div>
                    <div className="text-center p-4 bg-dark-bg rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Total Blocking Time</p>
                      <p className="text-xl font-semibold text-gray-100">{results.performance.tbt}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-dark-bg rounded-xl">
                    <p className="text-sm text-gray-400">
                      Rating: <span className={`font-semibold ${
                        results.performance.rating === 'Good' ? 'text-green-400' :
                        results.performance.rating === 'Needs Improvement' ? 'text-yellow-400' : 'text-red-400'
                      }`}>{results.performance.rating}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* IP Address Card */}
          <motion.div variants={itemVariants}>
            <Card className="h-full hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(99,102,241,0.4)]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-indigo-500/10">
                    <Network className="w-5 h-5 text-indigo-400" />
                  </div>
                  <CardTitle className="text-lg">IP Address</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-mono font-semibold text-indigo-400">
                  {results.ipAddress}
                </p>
                <p className="text-sm text-gray-500 mt-2">Server IP</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Domain Info Card */}
          <motion.div variants={itemVariants}>
            <Card className="h-full hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(168,85,247,0.4)]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <Globe className="w-5 h-5 text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">Domain Info</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-gray-100 break-all mb-4">
                  {results.domain}
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    Age: <span className="text-gray-300">{results.domainAge}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Registrar: <span className="text-gray-300">{results.registrar}</span>
                  </p>
                  {results.expiryDate && results.expiryDate !== 'N/A' && (
                    <p className="text-sm text-gray-500">
                      Expires: <span className="text-gray-300">{results.expiryDate}</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* SSL Certificate Card */}
          <motion.div variants={itemVariants}>
            <Card className="h-full hover:border-green-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(34,197,94,0.4)]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <Lock className="w-5 h-5 text-green-400" />
                  </div>
                  <CardTitle className="text-lg">SSL Certificate</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {results.ssl.valid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-gray-100">
                      {results.ssl.valid ? 'Valid Certificate' : 'Invalid Certificate'}
                    </span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-gray-500">
                      Issuer: <span className="text-gray-300">{results.ssl.issuer}</span>
                    </p>
                    <p className="text-gray-500">
                      Expires: <span className="text-gray-300">{results.ssl.expires}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Redirect Info Card */}
          <motion.div variants={itemVariants}>
            <Card className="h-full hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(236,72,153,0.4)]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-pink-500/10">
                    <ExternalLink className="w-5 h-5 text-pink-400" />
                  </div>
                  <CardTitle className="text-lg">Redirect Info</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {results.redirects.hasRedirects ? (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    <span className="text-gray-100">
                      {results.redirects.hasRedirects
                        ? `${results.redirects.count} Redirects`
                        : 'No Redirects'}
                    </span>
                  </div>
                  {results.redirects.hasRedirects && (
                    <p className="text-sm text-gray-500">
                      Final URL may differ from original
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Location Card */}
          <motion.div variants={itemVariants}>
            <Card className="h-full hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(59,130,246,0.4)]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">Server Location</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-xs text-blue-300">
                    ℹ️ This is where the website's server is hosted, not your location
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-gray-100">
                    {results.location.country}
                  </p>
                  <p className="text-sm text-gray-500">
                    City: <span className="text-gray-300">{results.location.city}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Region: <span className="text-gray-300">{results.location.region}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Server Info Card */}
          <motion.div variants={itemVariants}>
            <Card className="h-full hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(6,182,212,0.4)]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-cyan-500/10">
                    <Server className="w-5 h-5 text-cyan-400" />
                  </div>
                  <CardTitle className="text-lg">Server Info</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    ISP: <span className="text-gray-300">{results.server.isp}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Host: <span className="text-gray-300">{results.server.host}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Type: <span className="text-gray-300">{results.server.type}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* DNS Records Card */}
          {results.dns && (
            <motion.div variants={itemVariants}>
              <Card className="h-full hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(99,102,241,0.4)]">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-indigo-500/10">
                      <Database className="w-5 h-5 text-indigo-400" />
                    </div>
                    <CardTitle className="text-lg">DNS Records</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                    <p className="text-xs text-indigo-300">
                      ℹ️ Shows how many DNS entries exist (0 may mean API limit reached)
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">A Records:</span>
                      <span className="text-gray-100 font-semibold">{results.dns.aRecords}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">MX Records:</span>
                      <span className="text-gray-100 font-semibold">{results.dns.mxRecords}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">TXT Records:</span>
                      <span className="text-gray-100 font-semibold">{results.dns.txtRecords}</span>
                    </div>
                    <div className="pt-2 border-t border-dark-border">
                      <div className="flex items-center space-x-2">
                        {results.dns.hasEmail ? (
                          <>
                            <Mail className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-green-400">Email Configured</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-500">No Email Setup</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsSection;
