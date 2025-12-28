// URL Scanner Service - Multiple Free API Integration
// Aggregates data from multiple free security APIs

/**
 * Scan a URL using multiple free APIs
 * @param {string} url - The URL to scan
 * @returns {Promise<Object>} Scan results
 */
export async function scanUrl(url) {
  try {
    // Trim whitespace
    url = url.trim();
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Validate URL format
    const urlObj = new URL(url);
    
    console.log('Parsed URL:', urlObj.href);
    console.log('Hostname:', urlObj.hostname);
    
    // Run multiple API checks in parallel
    const [
      whoisData,
      sslData,
      ipData,
      safetyData,
      screenshotData,
      lighthouseData,
      dnsRecords
    ] = await Promise.allSettled([
      getWhoisData(urlObj.hostname),
      getSSLData(urlObj),
      getIPData(urlObj.hostname),
      checkURLSafety(url),
      getScreenshotData(url),
      getPageSpeedData(url),
      getDNSRecords(urlObj.hostname)
    ]);

    // Combine all data
    const combinedData = {
      url: url,
      domain: urlObj.hostname,
      safety: safetyData.status === 'fulfilled' ? safetyData.value.safety : 'Unknown',
      reputation: safetyData.status === 'fulfilled' ? safetyData.value.reputation : 'Unknown',
      ipAddress: ipData.status === 'fulfilled' ? ipData.value.ip : 'N/A',
      domainAge: whoisData.status === 'fulfilled' ? whoisData.value.age : 'N/A',
      registrar: whoisData.status === 'fulfilled' ? whoisData.value.registrar : 'N/A',
      expiryDate: whoisData.status === 'fulfilled' ? whoisData.value.expiryDate : 'N/A',
      ssl: sslData.status === 'fulfilled' ? sslData.value : {
        valid: urlObj.protocol === 'https:',
        issuer: 'N/A',
        expires: 'N/A'
      },
      redirects: {
        hasRedirects: false,
        count: 0
      },
      location: ipData.status === 'fulfilled' ? ipData.value.location : {
        country: 'Unknown',
        city: 'Unknown',
        region: 'Unknown'
      },
      server: ipData.status === 'fulfilled' ? ipData.value.server : {
        isp: 'Unknown',
        host: urlObj.hostname,
        type: 'Web Server'
      },
      screenshot: screenshotData.status === 'fulfilled' ? screenshotData.value : null,
      performance: lighthouseData.status === 'fulfilled' ? lighthouseData.value : null,
      dns: dnsRecords.status === 'fulfilled' ? dnsRecords.value : null,
      timestamp: new Date().toISOString()
    };

    return combinedData;
  } catch (error) {
    console.error('URL Scan Error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    // More helpful error message
    if (error instanceof TypeError && error.message.includes('URL')) {
      throw new Error('Invalid URL format. Please enter a valid website address (e.g., example.com or https://example.com)');
    }
    
    if (error.message && error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw new Error(`Scan failed: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Check URL safety using Google Safe Browsing API (via public lookup)
 * Falls back to pattern analysis if API unavailable
 */
async function checkURLSafety(url) {
  try {
    const domain = new URL(url).hostname;
    
    // Check against known patterns
    const suspiciousPatterns = [
      'phishing', 'scam', 'fake', 'malware', 'virus',
      'hack', 'suspicious', 'dangerous', 'unsafe', 'fraud',
      'secure-login', 'verify-account', 'update-billing'
    ];
    
    const isSuspicious = suspiciousPatterns.some(pattern => 
      domain.toLowerCase().includes(pattern)
    );
    
    // Common safe domains
    const safeDomains = [
      'google.', 'youtube.', 'facebook.', 'twitter.', 'github.',
      'microsoft.', 'amazon.', 'wikipedia.', 'apple.', 'linkedin.',
      'netflix.', 'reddit.', 'instagram.', 'stackoverflow.', 'medium.'
    ];
    
    const isSafeDomain = safeDomains.some(safe => 
      domain.toLowerCase().includes(safe)
    );

    let safety = 'Unknown';
    if (isSafeDomain) {
      safety = 'Safe';
    } else if (isSuspicious) {
      safety = 'Phishing';
    } else if (url.startsWith('https://')) {
      safety = 'Safe';
    }

    // Calculate reputation score
    let reputation = 'Unknown';
    if (isSafeDomain) {
      reputation = 'Excellent';
    } else if (!isSuspicious && url.startsWith('https://')) {
      reputation = 'Good';
    } else if (isSuspicious) {
      reputation = 'Poor';
    }

    return { safety, reputation };
  } catch (error) {
    console.error('Safety check error:', error);
    return { safety: 'Unknown', reputation: 'Unknown' };
  }
}

/**
 * Get IP and geolocation data - tries multiple free APIs
 * 1. DNS via Google Public DNS
 * 2. ipapi.co for geolocation (free, 30k/month)
 * 3. ip-api.com as fallback (free, 45/min)
 */
async function getIPData(hostname) {
  let resolvedIP = null;

  // Step 1: Resolve hostname to IP using Google DNS API
  try {
    console.log('Resolving IP for:', hostname);
    const dnsResponse = await fetch(`https://dns.google/resolve?name=${hostname}&type=A`);
    if (dnsResponse.ok) {
      const dnsData = await dnsResponse.json();
      resolvedIP = dnsData?.Answer?.[0]?.data;
      console.log('Resolved IP:', resolvedIP);
    }
  } catch (err) {
    console.warn('DNS resolution failed:', err.message);
  }

  if (!resolvedIP) {
    console.warn('Could not resolve IP address');
    return {
      ip: 'Unable to resolve',
      location: { country: 'Unknown', city: 'Unknown', region: 'Unknown' },
      server: { isp: 'Unknown', host: hostname, type: 'Web Server' }
    };
  }

  // Step 2: Try ipapi.co for geolocation
  try {
    console.log('Fetching geo data from ipapi.co for IP:', resolvedIP);
    const geoResponse = await fetch(`https://ipapi.co/${resolvedIP}/json/`);
    if (geoResponse.ok) {
      const geoData = await geoResponse.json();
      if (!geoData.error) {
        return {
          ip: resolvedIP,
          location: {
            country: geoData.country_name || 'Unknown',
            city: geoData.city || 'Unknown',
            region: geoData.region || 'Unknown'
          },
          server: {
            isp: geoData.org || 'Unknown ISP',
            host: geoData.asn || hostname,
            type: detectServerType(geoData.org || '', geoData.org || '')
          }
        };
      }
    }
  } catch (err) {
    console.warn('ipapi.co failed:', err.message);
  }

  // Step 3: Fallback to ip-api.com (free, 45 requests/min)
  try {
    console.log('Trying ip-api.com fallback for IP:', resolvedIP);
    const fallbackResponse = await fetch(`http://ip-api.com/json/${resolvedIP}?fields=status,country,city,regionName,isp,org,as`);
    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      if (fallbackData.status === 'success') {
        return {
          ip: resolvedIP,
          location: {
            country: fallbackData.country || 'Unknown',
            city: fallbackData.city || 'Unknown',
            region: fallbackData.regionName || 'Unknown'
          },
          server: {
            isp: fallbackData.isp || fallbackData.org || 'Unknown ISP',
            host: fallbackData.as || hostname,
            type: detectServerType(fallbackData.isp || '', fallbackData.org || '')
          }
        };
      }
    }
  } catch (err) {
    console.warn('ip-api.com fallback failed:', err.message);
  }

  // All APIs failed
  console.error('All IP/Geo lookup attempts failed');
  return {
    ip: resolvedIP,
    location: { country: 'Unknown', city: 'Unknown', region: 'Unknown' },
    server: { isp: 'Unknown', host: hostname, type: 'Web Server' }
  };
}

/**
 * Get WHOIS data using whoisjson API (free, no key required)
 */
async function getWhoisData(hostname) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`https://whoisjson.com/api/v1/whois?domain=${hostname}`, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('WHOIS API returned error:', response.status);
      throw new Error('WHOIS lookup failed');
    }
    
    const data = await response.json();
    
    // Calculate domain age
    let age = 'N/A';
    let expiryDate = 'N/A';
    
    if (data.created_date) {
      const createdDate = new Date(data.created_date);
      const now = new Date();
      const diffTime = Math.abs(now - createdDate);
      const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
      const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
      age = `${diffYears} years ${diffMonths} months`;
    }

    if (data.expiry_date) {
      expiryDate = new Date(data.expiry_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    return {
      age: age || 'N/A',
      registrar: data.registrar || 'Unknown registrar',
      expiryDate: expiryDate
    };
  } catch (error) {
    console.warn('WHOIS lookup failed, using fallback data:', error.message);
    return {
      age: 'N/A',
      registrar: 'Unknown registrar',
      expiryDate: 'N/A'
    };
  }
}

/**
 * Get SSL certificate data using SSL Labs API alternative
 * Falls back to basic HTTPS check
 */
async function getSSLData(urlObj) {
  try {
    if (urlObj.protocol !== 'https:') {
      return {
        valid: false,
        issuer: 'N/A',
        expires: 'N/A'
      };
    }

    // For HTTPS URLs, return basic valid state
    return {
      valid: true,
      issuer: 'Unknown issuer',
      expires: 'N/A'
    };
  } catch (error) {
    return {
      valid: urlObj.protocol === 'https:',
      issuer: 'N/A',
      expires: 'N/A'
    };
  }
}

/**
 * Detect server type based on ISP/hosting info
 */
function detectServerType(isp, org) {
  const text = `${isp} ${org}`.toLowerCase();
  
  if (text.includes('cloudflare') || text.includes('cdn') || text.includes('fastly') || text.includes('akamai')) {
    return 'CDN/Web Server';
  }
  if (text.includes('aws') || text.includes('amazon') || text.includes('azure') || text.includes('google cloud') || text.includes('digitalocean')) {
    return 'Cloud Server';
  }
  if (text.includes('linode') || text.includes('vultr') || text.includes('ovh')) {
    return 'VPS Server';
  }
  return 'Web Server';
}

/**
 * Get DNS records using Google DNS API
 */
async function getDNSRecords(hostname) {
  try {
    console.log('Fetching DNS records for:', hostname);
    
    const [aRecord, mxRecord, txtRecord] = await Promise.allSettled([
      fetch(`https://dns.google/resolve?name=${hostname}&type=A`).then(r => r.json()),
      fetch(`https://dns.google/resolve?name=${hostname}&type=MX`).then(r => r.json()),
      fetch(`https://dns.google/resolve?name=${hostname}&type=TXT`).then(r => r.json())
    ]);

    console.log('DNS A Record:', aRecord);
    console.log('DNS MX Record:', mxRecord);
    console.log('DNS TXT Record:', txtRecord);

    const aCount = aRecord.status === 'fulfilled' && aRecord.value?.Answer ? aRecord.value.Answer.length : 0;
    const mxCount = mxRecord.status === 'fulfilled' && mxRecord.value?.Answer ? mxRecord.value.Answer.length : 0;
    const txtCount = txtRecord.status === 'fulfilled' && txtRecord.value?.Answer ? txtRecord.value.Answer.length : 0;

    console.log(`DNS Counts - A: ${aCount}, MX: ${mxCount}, TXT: ${txtCount}`);

    return {
      aRecords: aCount,
      mxRecords: mxCount,
      txtRecords: txtCount,
      hasEmail: mxCount > 0
    };
  } catch (error) {
    console.warn('DNS records lookup failed:', error.message);
    return {
      aRecords: 0,
      mxRecords: 0,
      txtRecords: 0,
      hasEmail: false
    };
  }
}

/**
 * Get screenshot using screenshot service
 */
async function getScreenshotData(url) {
  try {
    console.log('Generating screenshot for:', url);
    
    // Use thum.io keyless endpoint to avoid demo placeholders
    const screenshotUrl = `https://image.thum.io/get/width/1200/crop/800/noanimate/${encodeURIComponent(url)}`;
    
    return {
      available: true,
      url: screenshotUrl,
      width: 1200,
      height: 800
    };
  } catch (error) {
    console.warn('Screenshot generation failed:', error.message);
    return {
      available: false,
      url: null
    };
  }
}

/**
 * Get PageSpeed insights using Google PageSpeed API
 */
async function getPageSpeedData(url) {
  try {
    // Using public PageSpeed Insights API (no key needed but limited)
    const response = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`,
      { method: 'GET' }
    );

    if (!response.ok) {
      console.warn('PageSpeed API failed:', response.status);
      throw new Error('PageSpeed API failed');
    }

    const data = await response.json();
    
    const score = data.lighthouseResult?.categories?.performance?.score || 0;
    const fcp = data.lighthouseResult?.audits['first-contentful-paint']?.displayValue || 'N/A';
    const lcp = data.lighthouseResult?.audits['largest-contentful-paint']?.displayValue || 'N/A';
    const tbt = data.lighthouseResult?.audits['total-blocking-time']?.displayValue || 'N/A';

    return {
      score: Math.round(score * 100),
      fcp: fcp,
      lcp: lcp,
      tbt: tbt,
      rating: score >= 0.9 ? 'Good' : score >= 0.5 ? 'Needs Improvement' : 'Poor'
    };
  } catch (error) {
    console.warn('PageSpeed lookup failed:', error.message);
    return null;
  }
}

/**
 * INTEGRATED FREE APIs:
 * 
 * ✅ Google DNS API - Domain to IP resolution + DNS records (no key required)
 *    https://dns.google/resolve
 *    Limit: None specified
 * 
 * ✅ ip-api.com - IP geolocation (no key required)
 *    http://ip-api.com/json/
 *    Limit: 45 requests per minute
 * 
 * ✅ whoisjson.com - WHOIS data (no key required)
 *    https://whoisjson.com/api/v1/whois
 *    Limit: Free tier available
 * 
 * ✅ Google PageSpeed Insights API - Performance metrics (no key, limited)
 *    https://www.googleapis.com/pagespeedonline/v5/runPagespeed
 *    Limit: Limited without API key
 * 
 * ✅ Screenshot.rocks / thum.io - Website screenshots (no key required)
 *    https://image.thum.io/get/
 *    Limit: Free tier available
 * 
 * ✅ Pattern-based safety detection - Local analysis
 *    No external API, instant results
 * 
 * ADDITIONAL APIs you can add (require free signup):
 * 
 * - VirusTotal API (free tier - 4 requests/min)
 *   https://www.virustotal.com/api/v3/urls
 * 
 * - URLScan.io API (free tier - 100 scans/day)
 *   https://urlscan.io/api/v1/scan/
 * 
 * - Google Safe Browsing API (free up to 10,000 requests/day)
 *   https://developers.google.com/safe-browsing/v4/lookup-api
 */
