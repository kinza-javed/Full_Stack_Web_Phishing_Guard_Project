// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./urlresult.css";

// export default function URLResult() {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   if (!state) {
//     return (
//       <div style={{ padding: 30 }}>
//         <h2>No result found</h2>
//         <button onClick={() => navigate("/scanner")}>Go Back</button>
//       </div>
//     );
//   }

//   const {
//     url,
//     risk,
//     description,
//     features,
//     harmReasons,
//   } = state;

//   return (
//     <div className="result-container">
//       <h2>Scan Result</h2>

//       <div className="result-card">
//         <h3>URL:</h3>
//         <p>{url}</p>

//         <h3>Risk Level:</h3>
//         <p className="risk-level">{risk}</p>

//         <h3>Description:</h3>
//         <p>{description}</p>

//         <h3>Features:</h3>
//         <ul>
//           <li>HTTPS: {features.https ? "Yes" : "No"}</li>
//           <li>Domain Age: {features.domainAge}</li>
//           <li>Length: {features.length} chars</li>
//           <li>Keywords: {features.keywords.join(", ")}</li>
//         </ul>

//         <h3>Possible Harm:</h3>
//         <ul>
//           {harmReasons.map((harm, i) => (
//             <li key={i}>{harm}</li>
//           ))}
//         </ul>

//         <button
//           className="back-btn"
//           onClick={() => navigate("/scanner")}
//         >
//           Scan Another URL
//         </button>
//       </div>
//     </div>
//   );
// }





// src/pages/scanner/urlresult.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getScreenshotUrl, generateHarmReasons } from "../../utils/urlUtils";
import "./urlresult.css";

export default function URLResult() {
  const location = useLocation();
  const navigate = useNavigate();

  // Try both: location.state (navigate state) or query param ?data=...
  let data = location.state;
  if (!data) {
    const q = new URLSearchParams(location.search).get("data");
    if (q) {
      try { data = JSON.parse(decodeURIComponent(q)); } catch { data = null; }
    }
  }

  if (!data || !data.url) {
    return (
      <div style={{ padding: 24 }}>
        <h2>No scan result found</h2>
        <button onClick={() => navigate("/scanner")}>Back to scanner</button>
      </div>
    );
  }

  const harms = data.harmReasons || generateHarmReasons(data.url, data.rawAnalysis || { label: data.risk });

  return (
    <div className="pg-result-root">
      <div className="res-left">
        <h1>Scan Result</h1>
        <div className="res-card">
          <div className="res-row">
            <div><strong>URL</strong><div className="muted">{data.url}</div></div>
            <div className="res-score">
              <div className={`badge ${data.risk?.toLowerCase()}`}>{data.risk}</div>
              <div className="score-large">{data.score ?? "N/A"}</div>
            </div>
          </div>

          <h3>Description</h3>
          <p>{data.description}</p>

          <h3>Technical features</h3>
          <div className="feat-grid">
            <div className="feat"><label>HTTPS</label><div>{data.features?.https ? "Yes" : "No"}</div></div>
            <div className="feat"><label>Domain age</label><div>{data.features?.domainAge || "Unknown"}</div></div>
            <div className="feat"><label>Length</label><div>{data.features?.length || "?"}</div></div>
            <div className="feat"><label>Keywords</label><div>{data.features?.keywords || "None"}</div></div>
          </div>

          <h3>What this URL might do</h3>
          <ul className="harm-list">{harms.map((h,i)=> <li key={i}>{h}</li>)}</ul>

          <div style={{ marginTop: 12 }} className="res-actions">
            <button onClick={() => { const w = window.open("", "_blank"); w.document.write(`<img src="${getScreenshotUrl(data.url)}" />`); }}>Open Screenshot</button>
            <button onClick={() => { const s = encodeURIComponent(JSON.stringify(data)); window.location.href = `/scan-result?data=${s}`; }}>Share Link</button>
            <button onClick={() => {
              const win = window.open("", "_blank");
              win.document.write(`<html><body><pre>${JSON.stringify(data, null, 2)}</pre></body></html>`);
              win.print();
            }}>Export / Print</button>
            <button onClick={() => navigate("/scanner")}>Scan another</button>
          </div>
        </div>
      </div>

      <div className="res-right">
        <div className="s-image">
          <img src={getScreenshotUrl(data.url)} alt="preview" onError={(e)=>{e.target.alt="Preview not available"; e.target.style.opacity=0.6;}} />
        </div>

        <div className="s-info">
          <h4>Quick checks</h4>
          <ul>
            <li title="HTTPS presence">HTTPS: {data.features?.https ? "Yes" : "No"}</li>
            <li title="Shortener detection">Shortener: {/(bit\.ly|tinyurl|t\.co|goo\.gl|is\.gd)/i.test(data.url) ? "Yes" : "No"}</li>
            <li title="Domain length">Length: {data.features?.length}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
