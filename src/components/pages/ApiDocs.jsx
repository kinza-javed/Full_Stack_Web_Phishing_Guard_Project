import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Key, Zap, Copy, Check, Terminal, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

const ApiDocs = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);

  const endpoints = [
    {
      method: 'POST',
      path: '/api/scan',
      description: 'Scan a URL for security threats and detailed information',
      params: [
        { name: 'url', type: 'string', required: true, description: 'The URL to scan' },
        { name: 'deep_scan', type: 'boolean', required: false, description: 'Enable deep scanning' },
      ],
      response: `{
  "status": "success",
  "data": {
    "safety": "Safe",
    "ipAddress": "104.26.10.123",
    "domain": "example.com",
    "ssl": { "valid": true },
    "location": { "country": "US" }
  }
}`,
    },
    {
      method: 'GET',
      path: '/api/history',
      description: 'Retrieve scan history for authenticated user',
      params: [
        { name: 'limit', type: 'number', required: false, description: 'Number of results (default: 50)' },
        { name: 'offset', type: 'number', required: false, description: 'Pagination offset' },
      ],
      response: `{
  "status": "success",
  "data": {
    "scans": [...],
    "total": 150
  }
}`,
    },
    {
      method: 'GET',
      path: '/api/stats',
      description: 'Get global statistics about scanned links',
      params: [],
      response: `{
  "status": "success",
  "data": {
    "total_scans": 50000000,
    "threats_detected": 125000
  }
}`,
    },
  ];

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const features = [
    { icon: Zap, title: 'Fast & Reliable', description: 'Low latency responses with 99.9% uptime' },
    { icon: Key, title: 'API Key Auth', description: 'Secure authentication with rotating keys' },
    { icon: Code, title: 'RESTful Design', description: 'Standard HTTP methods and JSON responses' },
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
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-6">
            <Terminal className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              API Documentation
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Integrate Phishing Guard's powerful scanning capabilities into your applications with our RESTful API
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <Card key={index} className="hover:border-indigo-500/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-3 rounded-xl bg-indigo-500/10 mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <Card className="border-indigo-500/30">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-indigo-400" />
                <CardTitle>Getting Started</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-3">Authentication</h3>
                <p className="text-gray-400 mb-4">
                  All API requests require authentication using an API key. Include your key in the request header:
                </p>
                <div className="bg-dark-bg rounded-xl p-4 font-mono text-sm border border-dark-border">
                  <code className="text-green-400">Authorization: Bearer YOUR_API_KEY</code>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-3">Base URL</h3>
                <div className="bg-dark-bg rounded-xl p-4 font-mono text-sm border border-dark-border">
                  <code className="text-indigo-400">https://api.linkinspector.com/v1</code>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-3">Rate Limits</h3>
                <p className="text-gray-400">
                  Free tier: <span className="text-indigo-400 font-semibold">100 requests/hour</span> | 
                  Pro tier: <span className="text-purple-400 font-semibold">10,000 requests/hour</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Endpoints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              API Endpoints
            </span>
          </h2>
          <div className="space-y-6">
            {endpoints.map((endpoint, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="hover:border-indigo-500/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          endpoint.method === 'POST' 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-lg font-mono text-gray-100">{endpoint.path}</code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(endpoint.path, index)}
                        className="p-2 rounded-lg bg-dark-hover hover:bg-dark-border transition-colors"
                      >
                        {copiedEndpoint === index ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    
                    <p className="text-gray-400 mb-6">{endpoint.description}</p>

                    {endpoint.params.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-300 mb-3">Parameters</h4>
                        <div className="space-y-2">
                          {endpoint.params.map((param, i) => (
                            <div key={i} className="flex items-start space-x-3 text-sm">
                              <code className="text-indigo-400 font-mono">{param.name}</code>
                              <span className="text-gray-500">•</span>
                              <span className="text-purple-400">{param.type}</span>
                              {param.required && (
                                <span className="text-red-400 text-xs">(required)</span>
                              )}
                              <span className="text-gray-400 flex-1">- {param.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3">Response Example</h4>
                      <div className="bg-dark-bg rounded-xl p-4 overflow-x-auto border border-dark-border">
                        <pre className="text-sm">
                          <code className="text-gray-300">{endpoint.response}</code>
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <Card className="border-indigo-500/30 bg-gradient-to-br from-dark-card to-dark-hover">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Ready to Get Started?
              </h3>
              <p className="text-gray-400 mb-6">
                Sign up now and get your API key instantly. Start with 100 free requests per hour.
              </p>
              <Button size="lg" className="font-semibold">
                <Key className="w-5 h-5 mr-2" />
                Get Your API Key
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ApiDocs;
