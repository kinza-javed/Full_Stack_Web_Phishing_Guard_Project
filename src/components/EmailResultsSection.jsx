import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, AlertTriangle, CheckCircle2, XCircle, 
  Mail, Database, Server, Activity, AlertCircle,
  TrendingUp, Lock, Globe, Target
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

const EmailResultsSection = ({ results }) => {
  if (!results) return null;

  const getSafetyColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'safe':
        return 'text-green-400 bg-green-500/10';
      case 'caution':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'suspicious':
        return 'text-orange-400 bg-orange-500/10';
      case 'dangerous':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getSafetyIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'safe':
        return <CheckCircle2 className="w-8 h-8" />;
      case 'caution':
        return <AlertCircle className="w-8 h-8" />;
      case 'suspicious':
        return <AlertTriangle className="w-8 h-8" />;
      case 'dangerous':
        return <XCircle className="w-8 h-8" />;
      default:
        return <Shield className="w-8 h-8" />;
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
        >
          Email Scan Results
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Safety Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className={`${getSafetyColor(results.safety)} border-2 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(99,102,241,0.4)] transition-all duration-300`}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  {getSafetyIcon(results.safety)}
                  <span>Safety Status: {results.safety}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Email:</span>
                    <span className="font-mono text-white">{results.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Safety Score:</span>
                    <span className="font-bold text-2xl">{results.safetyScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        results.safetyScore >= 80 ? 'bg-green-500' :
                        results.safetyScore >= 60 ? 'bg-yellow-500' :
                        results.safetyScore >= 40 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${results.safetyScore}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Email Validation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(236,72,153,0.4)] transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-pink-400" />
                  <span>Email Validation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Valid Format:</span>
                    <span className={results.validation?.isValid ? 'text-green-400' : 'text-red-400'}>
                      {results.validation?.isValid ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Format Check:</span>
                    <span className="text-white">{results.validation?.format || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">SMTP Valid:</span>
                    <span className="text-white">{results.validation?.smtp || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Disposable:</span>
                    <span className={results.validation?.disposable ? 'text-red-400' : 'text-green-400'}>
                      {results.validation?.disposable ? '✗ Yes' : '✓ No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Free Service:</span>
                    <span className="text-white">{results.validation?.freeService ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Breaches Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(239,68,68,0.4)] transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-red-400" />
                  <span>Data Breaches</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Breaches Found:</span>
                    <span className={results.breaches?.found ? 'text-red-400 font-bold' : 'text-green-400'}>
                      {results.breaches?.found ? `⚠ ${results.breaches.count}` : '✓ None'}
                    </span>
                  </div>
                  {results.breaches?.found && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Breach:</span>
                        <span className="text-white">{results.breaches.lastBreach || 'Unknown'}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-400 text-sm">Sources:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {results.breaches.sources?.slice(0, 3).map((source, idx) => (
                            <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {!results.breaches?.found && (
                    <p className="text-sm text-gray-400">This email has not been found in any known data breaches.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Domain Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(168,85,247,0.4)] transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span>Domain Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Domain:</span>
                    <span className="text-white font-mono">{results.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reputation:</span>
                    <span className="text-white">{results.domainInfo?.reputation || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Domain Age:</span>
                    <span className="text-white">{results.domainInfo?.age || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Registrar:</span>
                    <span className="text-white text-sm">{results.domainInfo?.registrar || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Country:</span>
                    <span className="text-white">{results.domainInfo?.country || 'Unknown'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* MX Records Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(34,197,94,0.4)] transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="w-5 h-5 text-green-400" />
                  <span>MX Records</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">MX Exists:</span>
                    <span className={results.mx?.exists ? 'text-green-400' : 'text-red-400'}>
                      {results.mx?.exists ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Valid:</span>
                    <span className={results.mx?.valid ? 'text-green-400' : 'text-red-400'}>
                      {results.mx?.valid ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  {results.mx?.servers?.length > 0 && (
                    <div className="mt-2">
                      <span className="text-gray-400 text-sm">Mail Servers:</span>
                      <div className="mt-1 space-y-1">
                        {results.mx.servers.map((server, idx) => (
                          <div key={idx} className="text-xs text-white bg-white/5 px-2 py-1 rounded font-mono">
                            {server}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Spam Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="h-full hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(251,191,36,0.4)] transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-yellow-400" />
                  <span>Spam Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Spam Score:</span>
                    <span className="text-white font-bold">{results.spam?.score || 0}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-full transition-all ${
                        results.spam?.score < 30 ? 'bg-green-500' :
                        results.spam?.score < 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${results.spam?.score || 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk Level:</span>
                    <span className={`font-semibold ${
                      results.spam?.risk === 'High' ? 'text-red-400' :
                      results.spam?.risk === 'Medium' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {results.spam?.risk || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Blacklisted:</span>
                    <span className={results.spam?.blacklisted ? 'text-red-400' : 'text-green-400'}>
                      {results.spam?.blacklisted ? '⚠ Yes' : '✓ No'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EmailResultsSection;
