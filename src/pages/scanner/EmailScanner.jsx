import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./emailScanner.css";

export default function EmailScanner() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  // Clear results when user changes (login/logout)
  useEffect(() => {
    setResult(null);
    setText("");
  }, [user]);

  function scanEmail() {
    if (!text.trim()) return;

    let score = 0;
    const flags = [];

    if (/urgent|immediately|action required/i.test(text)) {
      score += 40;
      flags.push("Urgency keywords detected");
    }

    if (/password|login|bank|account/i.test(text)) {
      score += 30;
      flags.push("Sensitive credential keywords found");
    }

    if (/(http:\/\/|bit\.ly|tinyurl)/i.test(text)) {
      score += 40;
      flags.push("Suspicious or shortened link present");
    }

    const label =
      score >= 70 ? "High Risk" :
      score >= 40 ? "Medium Risk" :
      "Low Risk";

    const explanation =
      label === "High Risk"
        ? "⚠️ This email shows clear phishing traits such as urgency, credential requests, and suspicious links."
        : label === "Medium Risk"
        ? "⚠️ Contains some warning signs. Review carefully before interacting."
        : "✔ Looks safe overall, but always verify sender identity.";

    setResult({ label, score, flags, explanation });
  }

  function copyText() {
    const content = `
Email Scan Result
-------------------
Risk: ${result.label}
Score: ${result.score}
Flags: 
${result.flags.map(f => "- " + f).join("\n")}
Explanation:
${result.explanation}`;
    navigator.clipboard.writeText(content);
    alert("Copied!");
  }

  function shareText() {
    if (navigator.share) {
      navigator.share({
        title: "Email Scan Result",
        text: `Risk: ${result.label}\n${result.explanation}`
      });
    } else {
      alert("Device does not support sharing.");
    }
  }

  function reportEmail() {
    window.open("https://safebrowsing.google.com/safebrowsing/report_phish/", "_blank");
  }

  return (
    <div className="email-box">
      <h2>Email Scanner</h2>
      <textarea
        placeholder="Paste suspicious email text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      <button onClick={scanEmail}>Scan Email</button>

      {result && (
        <div className="email-result">
          <h3>{result.label}</h3>
          <p>Score: {result.score}</p>

          <ul>
            {result.flags.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          <div className="ai-box">
            <strong>AI Explanation:</strong>
            <p>{result.explanation}</p>
          </div>

          <div className="actions">
            <button onClick={copyText}>Copy</button>
            <button onClick={shareText}>Share</button>
            <button className="danger" onClick={reportEmail}>Report Email</button>
          </div>
        </div>
      )}
    </div>
  );
}
