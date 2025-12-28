import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./urlscanner.css";

export default function URLScanner() {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  // Clear results when user changes (login/logout)
  useEffect(() => {
    setResult(null);
    setUrl("");
  }, [user]);

  function analyzeURL() {
    if (!url.trim()) return;

    let score = 0;
    const flags = [];

    const lowerUrl = url.toLowerCase();

    // Suspicious patterns
    if (lowerUrl.includes("http://")) {
      score += 20;
      flags.push("No HTTPS detected (less secure)");
    }

    if (/(bit\.ly|tinyurl|t\.co|shorturl)/.test(lowerUrl)) {
      score += 30;
      flags.push("Shortened link detected");
    }

    if (/login|update|verify|secure|bank/i.test(lowerUrl)) {
      score += 40;
      flags.push("Sensitive keyword in URL");
    }

    if (lowerUrl.length < 10) {
      score += 10;
      flags.push("URL unusually short");
    }

    const label =
      score >= 70 ? "High Risk" :
      score >= 40 ? "Medium Risk" :
      "Low Risk";

    // AI-style explanation
    let aiExplain = "";
    if (label === "High Risk") {
      aiExplain =
        "⚠️ This URL displays multiple phishing indicators such as dangerous keywords, missing HTTPS, and shortened link patterns often used by attackers.";
    } else if (label === "Medium Risk") {
      aiExplain =
        "⚠️ The URL has some suspicious traits. It's recommended to verify the source before continuing.";
    } else {
      aiExplain =
        "✔ This URL appears mostly safe, although users should always stay cautious and verify the domain.";
    }

    setResult({ label, score, flags, aiExplain, url });
  }

  function copyResult() {
    if (!result) return;

    const text = `
URL Scan Result
-----------------------
URL: ${result.url}
Risk: ${result.label}
Score: ${result.score}
Flags:
${result.flags.map(f => "- " + f).join("\n")}
AI Explanation:
${result.aiExplain}
    `.trim();

    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  }

  function shareResult() {
    if (navigator.share) {
      navigator.share({
        title: "Phishing Scan Result",
        text: `URL: ${result.url}\nRisk: ${result.label}\n${result.aiExplain}`,
      });
    } else {
      alert("Sharing not supported on this device.");
    }
  }

  function reportURL() {
    window.open(
      "https://safebrowsing.google.com/safebrowsing/report_phish/",
      "_blank"
    );
  }

  return (
    <div className="scan-box">
      <h2>URL Scanner</h2>

      <input
        type="text"
        placeholder="Paste a URL to scan..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={analyzeURL}>Scan URL</button>

      {result && (
        <div className="scan-result">
          <h3>{result.label}</h3>
          <p className="score">Score: {result.score}</p>

          <ul className="flags">
            {result.flags.map((flag, i) => (
              <li key={i}>{flag}</li>
            ))}
          </ul>

          <div className="ai-box">
            <strong>AI Explanation:</strong>
            <p>{result.aiExplain}</p>
          </div>

          <div className="actions">
            <button onClick={copyResult}>Copy</button>
            <button onClick={shareResult}>Share</button>
            <button className="danger" onClick={reportURL}>Report URL</button>
          </div>
        </div>
      )}
    </div>
  );
}
