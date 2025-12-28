import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, ShieldAlert, ShieldQuestion, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';

const HistorySection = ({ history, onDelete, onClearAll }) => {
  if (!history || history.length === 0) return null;

  const getSafetyIcon = (status) => {
    switch (status) {
      case 'Safe':
        return <Shield className="w-5 h-5 text-green-500" />;
      case 'Phishing':
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
      default:
        return <ShieldQuestion className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getSafetyColor = (status) => {
    switch (status) {
      case 'Safe':
        return 'border-green-500/30 hover:border-green-500/50';
      case 'Phishing':
        return 'border-red-500/30 hover:border-red-500/50';
      default:
        return 'border-yellow-500/30 hover:border-yellow-500/50';
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Scan History
                </span>
              </h2>
              <p className="text-gray-400 mt-2">Your recent link inspections</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{history.length} recent scans</span>
              </div>
              {onClearAll && history.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete all ${history.length} scans from history?`)) {
                      onClearAll();
                    }
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 backdrop-blur-md transition-all duration-300 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear All History</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item, index) => (
              <motion.div
                key={item._id || item.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`h-full ${getSafetyColor(item.safety)} transition-all duration-300 hover:shadow-glow cursor-pointer group`}>
                  <CardContent className="p-6 relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getSafetyIcon(item.safety)}
                        <span className={`text-sm font-semibold ${
                          item.safety === 'Safe' 
                            ? 'text-green-400' 
                            : item.safety === 'Phishing' 
                            ? 'text-red-400' 
                            : 'text-yellow-400'
                        }`}>
                          {item.safety}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                        {onDelete && (
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if (window.confirm('Delete this scan from history?')) {
                                onDelete(item._id || item.id); 
                              }
                            }}
                            className="px-2 py-1 rounded-full text-xs text-red-400 bg-red-500/10 backdrop-blur-md border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
                            aria-label="Delete history item"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-100 mb-2 truncate group-hover:text-indigo-400 transition-colors">
                      {item.domain}
                    </h3>

                    <div className="space-y-2 mb-4">
                      {item.scanType === 'url' ? (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">IP Address:</span>
                            <span className="text-gray-300 font-mono">{item.ipAddress || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Location:</span>
                            <span className="text-gray-300">{item.location || 'Unknown'}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Type:</span>
                            <span className="text-purple-400 font-semibold">Email Scan</span>
                          </div>
                          {item.breachCount !== undefined && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Breaches:</span>
                              <span className={item.breachCount > 0 ? 'text-red-400 font-semibold' : 'text-green-400'}>
                                {item.breachCount > 0 ? `⚠ ${item.breachCount}` : '✓ None'}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="pt-4 border-t border-dark-border flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{item.timestamp}</span>
                      </div>
                      {item.ssl && (
                        <div className="flex items-center space-x-1 text-xs">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-400">SSL Valid</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HistorySection;
