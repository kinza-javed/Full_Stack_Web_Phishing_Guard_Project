import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, Users, Globe, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const About = () => {
  const features = [
    {
      icon: Shield,
      title: 'Advanced Security',
      description: 'Our cutting-edge algorithms detect phishing, malware, and suspicious patterns in real-time.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get comprehensive scan results in milliseconds with our optimized infrastructure.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Lock,
      title: 'SSL Analysis',
      description: 'Deep inspection of SSL certificates, encryption strength, and security protocols.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Access to worldwide threat intelligence databases and real-time updates.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Trusted by Thousands',
      description: 'Join over 50,000+ users who trust our platform for their security needs.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Award,
      title: 'Industry Leading',
      description: 'Award-winning technology recognized by top cybersecurity organizations.',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const stats = [
    { value: '50M+', label: 'Links Scanned' },
    { value: '99.9%', label: 'Accuracy Rate' },
    { value: '24/7', label: 'Monitoring' },
    { value: '150+', label: 'Countries' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Phishing Guard
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make the internet safer, one link at a time. Our advanced
            technology protects millions of users from malicious websites and online threats.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:border-indigo-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Why Choose Us
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="h-full hover:border-indigo-500/50 transition-all duration-300 hover:shadow-glow">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-4`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20"
        >
          <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-dark-card dark:to-dark-hover">
            <CardContent className="p-8 md:p-12">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  In today's digital landscape, online threats are constantly evolving. Phishing Guard
                  was created to provide everyone with enterprise-grade security tools, completely free.
                  We believe cybersecurity should be accessible to all.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Our team of security experts and developers work around the clock to ensure our
                  detection algorithms stay ahead of emerging threats, protecting you and your loved
                  ones from malicious content.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
