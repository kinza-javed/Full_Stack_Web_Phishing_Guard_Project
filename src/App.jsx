import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ResultsSection from './components/ResultsSection';
import EmailResultsSection from './components/EmailResultsSection';
import HistorySection from './components/HistorySection';
import About from './components/pages/About';
import ApiDocs from './components/pages/ApiDocs';
import Contact from './components/pages/Contact';
import Auth from './components/pages/Auth';
import { scanUrl } from './services/urlScanner';
import { scanEmail } from './services/emailScanner';
import { saveScanToDatabase, getScanHistory, deleteScan } from './services/database';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('auth');
  const [scanResults, setScanResults] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [guestHistory, setGuestHistory] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Expose clearScanHistory function to window for Navbar logout
  React.useEffect(() => {
    window.clearScanHistory = () => {
      setScanHistory([]);
      setGuestHistory([]);
    };
    return () => {
      delete window.clearScanHistory;
    };
  }, []);

  // Check if user is already logged in
  React.useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setIsSignedIn(true);
      setUserName(user.name);
      setUserEmail(user.email);
      setCurrentPage('home');
      // Clear guest history when user logs in
      setGuestHistory([]);
      loadUserHistory(user.email);
    }
  }, []);

  // Load user's scan history from database
  const loadUserHistory = async (email) => {
    try {
      const scans = await getScanHistory(email);
      const formattedHistory = scans.map(scan => {
        // Determine if it's an email scan (check if ipAddress is N/A or url contains @)
        const isEmailScan = scan.ipAddress === 'N/A' || (scan.url && scan.url.includes('@'));
        
        return {
          id: scan._id,
          scanType: isEmailScan ? 'email' : 'url',
          domain: scan.domain,
          safety: scan.safety,
          ipAddress: isEmailScan ? undefined : scan.ipAddress,
          location: isEmailScan ? undefined : (scan.location?.country || 'Unknown'),
          ssl: scan.ssl?.valid || false,
          breachCount: isEmailScan ? (scan.ssl?.issuer === 'Email Scan' ? 0 : undefined) : undefined,
          timestamp: new Date(scan.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        };
      });
      setScanHistory(formattedHistory);
    } catch (error) {
      console.error('Failed to load scan history:', error);
    }
  };

  const handleScan = async (input, scanMode = 'url') => {
    try {
      console.log(`Starting ${scanMode} scan for:`, input);
      
      let data;
      
      if (scanMode === 'email') {
        // Use email scanner
        data = await scanEmail(input);
        // Ensure scanType is set
        if (!data.scanType) {
          data.scanType = 'email';
        }
        console.log('Email scan result:', data);
      } else {
        // Use URL scanner
        data = await scanUrl(input);
        // Ensure scanType is set
        if (!data.scanType) {
          data.scanType = 'url';
        }
        console.log('URL scan result:', data);
      }
      
      console.log('Setting scan results with scanType:', data.scanType);
      
      setScanResults(data);

      // Create history item
      const historyItem = scanMode === 'email' ? {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        scanType: 'email',
        domain: data.domain,
        safety: data.safety,
        breachCount: data.breaches?.count || 0,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
      } : {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        scanType: 'url',
        domain: data.domain,
        safety: data.safety,
        ipAddress: data.ipAddress,
        location: data.location.country,
        ssl: data.ssl.valid,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
      };

      // Save to database if user is signed in, otherwise save to guest history
      if (isSignedIn && userEmail) {
        const scanData = scanMode === 'email' ? {
          userEmail,
          domain: data.domain,
          url: data.email,
          safety: data.safety,
          ipAddress: 'N/A',
          location: {
            country: data.domainInfo?.country || 'Unknown',
            city: 'N/A',
            region: 'N/A'
          },
          ssl: {
            valid: !data.breaches?.found,
            issuer: 'Email Scan',
            expires: 'N/A'
          }
        } : {
          userEmail,
          domain: data.domain,
          url: input,
          safety: data.safety,
          ipAddress: data.ipAddress,
          location: {
            country: data.location.country,
            city: data.location.city,
            region: data.location.region
          },
          ssl: {
            valid: data.ssl.valid,
            issuer: data.ssl.issuer,
            expires: data.ssl.expires
          }
        };
        
        const result = await saveScanToDatabase(scanData);
        
        if (result.success) {
          // Reload history from database
          await loadUserHistory(userEmail);
        } else {
          // If database save fails, still show in UI for logged-in users
          setScanHistory(prev => [historyItem, ...prev.slice(0, 8)]);
        }
      } else {
        // Guest scan - add to guest history only
        setGuestHistory(prev => [historyItem, ...prev.slice(0, 8)]);
      }
      
      // Scroll to results
      setTimeout(() => {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth',
        });
      }, 100);
    } catch (error) {
      console.error(`Error scanning ${scanMode}:`, error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      alert(error.message || `Failed to scan ${scanMode}. Please try again.`);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />;
      case 'api':
        return <ApiDocs />;
      case 'contact':
        return <Contact />;
      case 'report':
        window.open('https://safebrowsing.google.com/safebrowsing/report_phish/', '_blank', 'noopener');
        setCurrentPage('home');
        return (
          <>
            <HeroSection onScan={handleScan} />
            <ResultsSection results={scanResults} />
          </>
        );
      case 'history':
        return <HistorySection 
          history={isSignedIn ? scanHistory : guestHistory} 
          onDelete={async (id) => {
            if (isSignedIn && userEmail) {
              await deleteScan(id);
              await loadUserHistory(userEmail);
            } else {
              setGuestHistory(prev => prev.filter((item, idx) => String(item.id ?? idx) !== String(id)));
            }
          }}
          onClearAll={async () => {
            if (isSignedIn && userEmail) {
              // Delete all scans from database
              for (const item of scanHistory) {
                await deleteScan(item.id);
              }
              await loadUserHistory(userEmail);
            } else {
              setGuestHistory([]);
            }
          }}
        />;
      case 'auth':
        return <Auth onSkip={() => { setCurrentPage('home'); setIsSignedIn(false); }} onLogin={(name, email) => { 
          setCurrentPage('home'); 
          setIsSignedIn(true); 
          setUserName(name);
          setUserEmail(email);
          // Clear guest history when logging in
          setGuestHistory([]);
          loadUserHistory(email);
        }} />;
      default:
        return (
          <>
            <HeroSection onScan={handleScan} />
            {(() => {
              console.log('Rendering results. scanResults:', scanResults);
              console.log('scanType:', scanResults?.scanType);
              
              if (!scanResults) return null;
              
              if (scanResults.scanType === 'email') {
                console.log('Showing EmailResultsSection');
                return <EmailResultsSection results={scanResults} />;
              } else {
                console.log('Showing ResultsSection');
                return <ResultsSection results={scanResults} />;
              }
            })()}
            <HistorySection 
              history={isSignedIn ? scanHistory : guestHistory} 
              onDelete={async (id) => {
                if (isSignedIn && userEmail) {
                  await deleteScan(id);
                  await loadUserHistory(userEmail);
                } else {
                  setGuestHistory(prev => prev.filter((item, idx) => String(item.id ?? idx) !== String(id)));
                }
              }}
              onClearAll={async () => {
                if (isSignedIn && userEmail) {
                  // Delete all scans from database
                  for (const item of scanHistory) {
                    await deleteScan(item.id);
                  }
                  await loadUserHistory(userEmail);
                } else {
                  setGuestHistory([]);
                }
              }}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {currentPage !== 'auth' && (
        <Navbar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isSignedIn={isSignedIn}
          setIsSignedIn={setIsSignedIn}
          userName={userName}
        />
      )}
      {renderPage()}

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

export default App;
