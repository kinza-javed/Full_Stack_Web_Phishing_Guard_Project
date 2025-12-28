// Email Scanner Service - Multiple Free API Integration
// Aggregates data from multiple free email security and validation APIs

/**
 * Scan an email using multiple free APIs
 * @param {string} email - The email to scan
 * @returns {Promise<Object>} Scan results
 */
export async function scanEmail(email) {
  try {
    email = email.trim().toLowerCase();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    const domain = email.split('@')[1];
    
    console.log('Scanning email:', email);
    console.log('Domain:', domain);
    
    // Run multiple API checks in parallel
    const [
      breachData,
      validationData,
      domainData,
      mxRecords,
      spamScore,
      disposableCheck
    ] = await Promise.allSettled([
      checkDataBreaches(email),
      validateEmail(email),
      getDomainReputation(domain),
      checkMXRecords(domain),
      getSpamScore(email),
      checkDisposableEmail(domain)
    ]);

    // Calculate overall safety score
    const safetyScore = calculateEmailSafety({
      breaches: breachData.status === 'fulfilled' ? breachData.value : null,
      validation: validationData.status === 'fulfilled' ? validationData.value : null,
      reputation: domainData.status === 'fulfilled' ? domainData.value : null,
      mx: mxRecords.status === 'fulfilled' ? mxRecords.value : null,
      spam: spamScore.status === 'fulfilled' ? spamScore.value : null,
      disposable: disposableCheck.status === 'fulfilled' ? disposableCheck.value : null
    });

    // Combine all data
    const combinedData = {
      scanType: 'email', // Important: mark as email scan
      email: email,
      domain: domain,
      safety: safetyScore.status,
      safetyScore: safetyScore.score,
      
      // Email validation
      validation: {
        isValid: validationData.status === 'fulfilled' ? validationData.value.valid : false,
        format: validationData.status === 'fulfilled' ? validationData.value.format : 'Unknown',
        smtp: validationData.status === 'fulfilled' ? validationData.value.smtp : 'Unknown',
        disposable: disposableCheck.status === 'fulfilled' ? disposableCheck.value.isDisposable : false,
        freeService: validationData.status === 'fulfilled' ? validationData.value.freeService : false
      },
      
      // Security breaches
      breaches: {
        found: breachData.status === 'fulfilled' ? breachData.value.found : false,
        count: breachData.status === 'fulfilled' ? breachData.value.count : 0,
        sources: breachData.status === 'fulfilled' ? breachData.value.sources : [],
        lastBreach: breachData.status === 'fulfilled' ? breachData.value.lastBreach : null
      },
      
      // Domain information
      domainInfo: {
        reputation: domainData.status === 'fulfilled' ? domainData.value.reputation : 'Unknown',
        age: domainData.status === 'fulfilled' ? domainData.value.age : 'Unknown',
        registrar: domainData.status === 'fulfilled' ? domainData.value.registrar : 'Unknown',
        country: domainData.status === 'fulfilled' ? domainData.value.country : 'Unknown'
      },
      
      // MX Records
      mx: {
        exists: mxRecords.status === 'fulfilled' ? mxRecords.value.exists : false,
        servers: mxRecords.status === 'fulfilled' ? mxRecords.value.servers : [],
        valid: mxRecords.status === 'fulfilled' ? mxRecords.value.valid : false
      },
      
      // Spam score
      spam: {
        score: spamScore.status === 'fulfilled' ? spamScore.value.score : 0,
        risk: spamScore.status === 'fulfilled' ? spamScore.value.risk : 'Unknown',
        blacklisted: spamScore.status === 'fulfilled' ? spamScore.value.blacklisted : false
      }
    };

    return combinedData;
  } catch (error) {
    console.error('Email scan error:', error);
    throw error;
  }
}

/**
 * Check if email was involved in data breaches (HaveIBeenPwned)
 */
async function checkDataBreaches(email) {
  try {
    // Using HaveIBeenPwned API
    const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`, {
      headers: {
        'User-Agent': 'Phishing-Guard-Scanner'
      }
    });

    if (response.status === 404) {
      return { found: false, count: 0, sources: [], lastBreach: null };
    }

    if (response.status === 200) {
      const breaches = await response.json();
      return {
        found: true,
        count: breaches.length,
        sources: breaches.slice(0, 5).map(b => b.Name),
        lastBreach: breaches[0]?.BreachDate || null
      };
    }

    return { found: false, count: 0, sources: [], lastBreach: null };
  } catch (error) {
    console.error('Breach check error:', error);
    return { found: false, count: 0, sources: [], lastBreach: null };
  }
}

/**
 * Validate email format and deliverability
 */
async function validateEmail(email) {
  try {
    const domain = email.split('@')[1];
    
    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const formatValid = emailRegex.test(email);
    
    // Check common free email providers
    const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com', 'mail.com', 'aol.com'];
    const isFree = freeProviders.includes(domain);
    
    // Try AbstractAPI for validation (free tier: 100/month)
    try {
      const response = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=YOUR_API_KEY&email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        return {
          valid: data.deliverability === 'DELIVERABLE',
          format: formatValid ? 'Valid' : 'Invalid',
          smtp: data.is_smtp_valid?.value ? 'Valid' : 'Unknown',
          freeService: data.is_free_email?.value || isFree
        };
      }
    } catch (e) {
      console.log('AbstractAPI not available, using basic validation');
    }
    
    return {
      valid: formatValid,
      format: formatValid ? 'Valid' : 'Invalid',
      smtp: 'Unknown',
      freeService: isFree
    };
  } catch (error) {
    console.error('Email validation error:', error);
    return { valid: false, format: 'Invalid', smtp: 'Unknown', freeService: false };
  }
}

/**
 * Get domain reputation and info
 */
async function getDomainReputation(domain) {
  try {
    // Try whois API for domain info
    const response = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_YOUR_KEY&domainName=${domain}&outputFormat=JSON`);
    
    if (!response.ok) {
      // Fallback to basic analysis
      const knownGood = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'protonmail.com'];
      const reputation = knownGood.includes(domain) ? 'Trusted' : 'Unknown';
      
      return {
        reputation,
        age: 'Unknown',
        registrar: 'Unknown',
        country: 'Unknown'
      };
    }

    const data = await response.json();
    const whoisRecord = data.WhoisRecord || {};
    
    return {
      reputation: whoisRecord.domainAvailability === 'AVAILABLE' ? 'Suspicious' : 'Active',
      age: whoisRecord.createdDate ? calculateAge(whoisRecord.createdDate) : 'Unknown',
      registrar: whoisRecord.registrarName || 'Unknown',
      country: whoisRecord.registrant?.country || 'Unknown'
    };
  } catch (error) {
    console.error('Domain reputation error:', error);
    
    // Default reputation for common providers
    const knownGood = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'protonmail.com', 'mail.com'];
    const reputation = knownGood.includes(domain) ? 'Trusted' : 'Unknown';
    
    return {
      reputation,
      age: 'Unknown',
      registrar: 'Unknown',
      country: 'Unknown'
    };
  }
}

/**
 * Check MX records for email domain
 */
async function checkMXRecords(domain) {
  try {
    // Using DNS over HTTPS (Cloudflare)
    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, {
      headers: { 'Accept': 'application/dns-json' }
    });

    if (!response.ok) {
      return { exists: false, servers: [], valid: false };
    }

    const data = await response.json();
    const mxRecords = data.Answer?.filter(record => record.type === 15) || [];
    
    return {
      exists: mxRecords.length > 0,
      servers: mxRecords.slice(0, 3).map(r => r.data?.split(' ')[1] || 'Unknown'),
      valid: mxRecords.length > 0
    };
  } catch (error) {
    console.error('MX record check error:', error);
    return { exists: false, servers: [], valid: false };
  }
}

/**
 * Calculate spam score
 */
async function getSpamScore(email) {
  try {
    const domain = email.split('@')[1];
    
    // Check against common spam indicators
    let score = 50; // Start at neutral
    let risk = 'Medium';
    let blacklisted = false;
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\d{5,}/, // Many consecutive numbers
      /(admin|support|noreply|info)@/, // Generic addresses
      /[._-]{2,}/ // Multiple special chars
    ];
    
    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(email)) score += 10;
    });
    
    // Check domain age and reputation
    const newDomains = domain.split('.').length > 2; // Subdomain
    if (newDomains) score += 15;
    
    // Try IPQualityScore API (free tier: 5000/month)
    try {
      const response = await fetch(`https://ipqualityscore.com/api/json/email/YOUR_API_KEY/${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        score = data.fraud_score || score;
        blacklisted = data.recent_abuse || false;
      }
    } catch (e) {
      console.log('IPQualityScore not available, using heuristics');
    }
    
    // Determine risk level
    if (score >= 75) risk = 'High';
    else if (score >= 50) risk = 'Medium';
    else risk = 'Low';
    
    return { score: Math.min(score, 100), risk, blacklisted };
  } catch (error) {
    console.error('Spam score error:', error);
    return { score: 50, risk: 'Unknown', blacklisted: false };
  }
}

/**
 * Check if domain is a disposable/temporary email service
 */
async function checkDisposableEmail(domain) {
  try {
    // List of common disposable email domains
    const disposableDomains = [
      'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
      'throwaway.email', 'getnada.com', 'temp-mail.org', 'mohmal.com',
      'sharklasers.com', 'trashmail.com', 'yopmail.com', 'maildrop.cc'
    ];
    
    const isDisposable = disposableDomains.some(d => domain.includes(d));
    
    // Try online API check
    try {
      const response = await fetch(`https://disposable.debounce.io/?email=${domain}`);
      if (response.ok) {
        const data = await response.json();
        return { isDisposable: data.disposable === 'true' || isDisposable };
      }
    } catch (e) {
      console.log('Disposable check API not available');
    }
    
    return { isDisposable };
  } catch (error) {
    console.error('Disposable email check error:', error);
    return { isDisposable: false };
  }
}

/**
 * Calculate overall email safety score
 */
function calculateEmailSafety(data) {
  let score = 100;
  let status = 'Safe';
  
  // Deduct for breaches
  if (data.breaches?.found) {
    score -= Math.min(data.breaches.count * 5, 30);
  }
  
  // Deduct for invalid email
  if (data.validation && !data.validation.valid) {
    score -= 40;
  }
  
  // Deduct for disposable email
  if (data.disposable?.isDisposable) {
    score -= 25;
  }
  
  // Deduct for high spam score
  if (data.spam?.score > 70) {
    score -= 20;
  }
  
  // Deduct for no MX records
  if (data.mx && !data.mx.exists) {
    score -= 15;
  }
  
  // Determine status
  if (score >= 80) status = 'Safe';
  else if (score >= 60) status = 'Caution';
  else if (score >= 40) status = 'Suspicious';
  else status = 'Dangerous';
  
  return { score: Math.max(score, 0), status };
}

/**
 * Calculate domain age from creation date
 */
function calculateAge(dateString) {
  try {
    const created = new Date(dateString);
    const now = new Date();
    const years = Math.floor((now - created) / (365.25 * 24 * 60 * 60 * 1000));
    
    if (years > 0) return `${years} year${years > 1 ? 's' : ''}`;
    
    const months = Math.floor((now - created) / (30 * 24 * 60 * 60 * 1000));
    return `${months} month${months > 1 ? 's' : ''}`;
  } catch (error) {
    return 'Unknown';
  }
}
