import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    topic, seconds, wordCount, wpm,
    fillerCount, transcript, emotionScores, currentEmotion
  } = location.state || {};

  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState(".");

  
  function formatTime(s) {
    if (!s) return "0:00";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    if (!topic) { navigate("/upload-topic"); return; }
    generateReport();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? "." : d + ".");
    }, 400);
    return () => clearInterval(interval);
  }, []);


  async function generateReport() {
    setLoading(true);
    try {
      const dominantEmotion = emotionScores && Object.keys(emotionScores).length > 0
        ? Object.entries(emotionScores).sort((a, b) => b[1] - a[1])[0][0]
        : currentEmotion || "neutral";

      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic, seconds, wordCount, wpm,
          fillerCount, transcript,
          currentEmotion: dominantEmotion,
          emotionScores
        })
      });

      const data = await res.json();
      setReport(data.report || "No report generated.");

    } catch (e) {
      console.error("Report fetch error:", e);
      setReport("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const sections = report ? report.split(/\n(?=\d\.)/).filter(Boolean) : [];
  const sectionColors = ["#ff6b35", "#34C759", "#FFB800", "#4FC3F7"];
  const sectionIcons = ["◎", "✦", "◈", "△"];

  return (
    <div style={{
      background: "#020008", minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif", color: "#fff",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orb {
          0%, 100% { transform: scale(1) translate(0,0); }
          50% { transform: scale(1.1) translate(20px,-20px); }
        }
        .gradient-text {
          background: linear-gradient(135deg, #ff6b35 0%, #ff2d6b 50%, #c026d3 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; padding: 20px; text-align: center;
          animation: fadeUp 0.5s ease forwards;
        }
        .report-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px; padding: 32px;
          margin-bottom: 16px;
          animation: fadeUp 0.5s ease forwards;
          transition: border-color 0.3s;
        }
        .report-card:hover { border-color: rgba(255,107,53,0.2); }
        .noise {
          position: fixed; inset: 0; opacity: 0.03;
          pointer-events: none; z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #020008; }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,53,0.3); border-radius: 2px; }
      `}</style>

      <div className="noise" />

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{
          position: "absolute", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(255,107,53,0.09) 0%, transparent 70%)",
          top: "-150px", right: "-150px", animation: "orb 12s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(192,38,211,0.07) 0%, transparent 70%)",
          bottom: "-100px", left: "-100px", animation: "orb 15s ease-in-out infinite reverse",
        }} />
      </div>

      {/* Navbar */}
      <nav style={{
        padding: "16px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)", background: "rgba(2,0,8,0.7)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20 }}>
          PitchPerfect<span className="gradient-text">.AI</span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Session Report</div>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.4)", padding: "8px 18px",
            borderRadius: 100, fontSize: 13, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Home
        </button>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 40px 100px", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{ marginBottom: 40, animation: "fadeUp 0.4s ease forwards" }}>
          <div style={{
            fontSize: 11, letterSpacing: 3, color: "rgba(255,107,53,0.7)",
            textTransform: "uppercase", marginBottom: 12, fontWeight: 500,
          }}>
            Session Complete
          </div>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            letterSpacing: "-2px", fontWeight: 400, lineHeight: 1.1, marginBottom: 8,
          }}>
            Your coaching{" "}
            <span className="gradient-text" style={{ fontStyle: "italic" }}>report</span>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
            {topic}
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 40 }}>
          {[
            { label: "Duration", val: formatTime(seconds), color: "#ff6b35" },
            { label: "Words", val: wordCount || 0, color: "#4FC3F7" },
            { label: "Avg WPM", val: wpm || "--", color: wpm > 170 ? "#FF2D55" : wpm > 120 ? "#34C759" : "#FFB800" },
            { label: "Fillers", val: fillerCount || 0, color: fillerCount > 10 ? "#FF2D55" : fillerCount > 5 ? "#FFB800" : "#34C759" },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, color: s.color }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>

        {/* Report */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              border: "2px solid rgba(255,107,53,0.2)",
              borderTop: "2px solid #ff6b35",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }} />
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", fontFamily: "'Instrument Serif', serif" }}>
              Analyzing your session{dots}
            </div>
          </div>
        ) : sections.length > 0 ? (
          <>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "rgba(255,107,53,0.7)", textTransform: "uppercase", marginBottom: 20, fontWeight: 500 }}>
              AI Coaching Report
            </div>
            {sections.map((section, i) => (
              <div key={i} className="report-card" style={{ animationDelay: `${i * 0.15}s` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ color: sectionColors[i % sectionColors.length], fontSize: 18 }}>
                    {sectionIcons[i % sectionIcons.length]}
                  </span>
                  <div style={{
                    fontSize: 11, letterSpacing: 2,
                    color: sectionColors[i % sectionColors.length],
                    textTransform: "uppercase", fontWeight: 500,
                  }}>
                    {section.split("\n")[0].replace(/^\d\.\s*/, "")}
                  </div>
                </div>
                <p style={{
                  fontSize: 15, color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.9, fontFamily: "Georgia, serif",
                  whiteSpace: "pre-wrap",
                }}>
                  {section.split("\n").slice(1).join("\n").trim()}
                </p>
              </div>
            ))}
          </>
        ) : (
          <div className="report-card">
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, whiteSpace: "pre-wrap", fontFamily: "Georgia, serif" }}>
              {report}
            </p>
          </div>
        )}

        {/* Bottom buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
          <button
            onClick={() => navigate("/upload-topic")}
            style={{
              flex: 1, padding: "18px",
              background: "linear-gradient(135deg, #ff6b35, #ff2d6b)",
              border: "none", color: "#fff", borderRadius: 14,
              fontSize: 16, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 20px 60px rgba(255,107,53,0.3)"; }}
            onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "none"; }}
          >
            Practice Again →
          </button>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "18px 28px",
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.4)",
              borderRadius: 14, fontSize: 16,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.color = "rgba(255,255,255,0.7)"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.color = "rgba(255,255,255,0.4)"; }}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
