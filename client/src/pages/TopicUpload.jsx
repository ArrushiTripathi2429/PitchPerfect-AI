import { useState } from "react";
import { useNavigate } from "react-router-dom";

const audienceTypes = ["General", "Professional", "Academic", "Kids", "Technical"];
const durations = ["1 min", "2 mins", "3 mins", "5 mins", "10 mins"];

export default function TopicUpload() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("General");
  const [duration, setDuration] = useState("3 mins");
  const [charCount, setCharCount] = useState(0);

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = () => {
    if (!topic.trim()) return;
    navigate("/script-preview", {
      state: { topic, audience, duration }
    });
  };

  return (
    <div style={{
      background: "#020008",
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
      color: "#fff",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes orb {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.1) translate(30px, -20px); }
          66% { transform: scale(0.9) translate(-20px, 30px); }
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        .fade-up { animation: fadeUp 0.6s ease forwards; opacity: 0; }
        .fade-up:nth-child(1) { animation-delay: 0.1s; }
        .fade-up:nth-child(2) { animation-delay: 0.2s; }
        .fade-up:nth-child(3) { animation-delay: 0.3s; }
        .fade-up:nth-child(4) { animation-delay: 0.4s; }
        .fade-up:nth-child(5) { animation-delay: 0.5s; }

        .topic-input {
          width: 100%;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          color: #fff;
          font-family: 'Instrument Serif', serif;
          font-size: 22px;
          padding: 24px 28px;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
          resize: none;
          line-height: 1.5;
        }
        .topic-input::placeholder {
          color: rgba(255,255,255,0.15);
          font-style: italic;
        }
        .topic-input:focus {
          border-color: rgba(255,107,53,0.4);
          box-shadow: 0 0 40px rgba(255,107,53,0.08);
        }

        .option-btn {
          padding: 10px 20px;
          border-radius: 100px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 400;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          color: rgba(255,255,255,0.4);
        }
        .option-btn:hover {
          border-color: rgba(255,107,53,0.3);
          color: rgba(255,255,255,0.7);
        }
        .option-btn.selected {
          background: rgba(255,107,53,0.1);
          border-color: rgba(255,107,53,0.4);
          color: #ff6b35;
        }

        .submit-btn {
          width: 100%;
          padding: 20px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #ff6b35, #ff2d6b);
          color: #fff;
          font-size: 17px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
        }
        .submit-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: shimmer 2.5s infinite;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 60px rgba(255,107,53,0.35);
        }
        .submit-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .gradient-text {
          background: linear-gradient(135deg, #ff6b35 0%, #ff2d6b 50%, #c026d3 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

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

      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{
          position: "absolute", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)",
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
        padding: "20px 60px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        background: "rgba(2,0,8,0.6)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div
          onClick={() => navigate("/")}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 20, letterSpacing: "-0.5px", cursor: "pointer"
          }}
        >
          PitchPerfect<span className="gradient-text">.AI</span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
          New Session
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #ff6b35, #ff2d6b)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 600, cursor: "pointer"
        }}>
          A
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 40px 100px", position: "relative", zIndex: 2 }}>

        {/* Page Header */}
        <div className="fade-up" style={{ marginBottom: 48, textAlign: "center" }}>
          <div style={{
            fontSize: 12, letterSpacing: 3, color: "rgba(255,107,53,0.7)",
            textTransform: "uppercase", marginBottom: 16, fontWeight: 500,
          }}>
            New Session
          </div>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(36px, 5vw, 56px)",
            letterSpacing: "-2px", fontWeight: 400,
            lineHeight: 1.1, marginBottom: 16,
          }}>
            What will you{" "}
            <span className="gradient-text" style={{ fontStyle: "italic" }}>
              present today?
            </span>
          </h1>
          <p style={{
            fontSize: 16, color: "rgba(255,255,255,0.35)",
            lineHeight: 1.7, fontWeight: 300, maxWidth: 480, margin: "0 auto"
          }}>
            Enter your topic and we'll craft a script. Then present live and get coached by AI.
          </p>
        </div>

        {/* Topic Input */}
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <div style={{ position: "relative" }}>
            <textarea
              className="topic-input"
              rows={3}
              placeholder="e.g. The impact of AI on modern education..."
              value={topic}
              onChange={handleTopicChange}
              maxLength={200}
            />
            <div style={{
              position: "absolute", bottom: 16, right: 20,
              fontSize: 12, color: "rgba(255,255,255,0.2)",
              fontFamily: "'DM Sans', sans-serif"
            }}>
              {charCount}/200
            </div>
          </div>
        </div>

        {/* Audience */}
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <div style={{
            fontSize: 12, letterSpacing: 2, color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase", marginBottom: 12, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif"
          }}>
            Audience
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {audienceTypes.map(a => (
              <button
                key={a}
                className={`option-btn ${audience === a ? "selected" : ""}`}
                onClick={() => setAudience(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="fade-up" style={{ marginBottom: 40 }}>
          <div style={{
            fontSize: 12, letterSpacing: 2, color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase", marginBottom: 12, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif"
          }}>
            Duration
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {durations.map(d => (
              <button
                key={d}
                className={`option-btn ${duration === d ? "selected" : ""}`}
                onClick={() => setDuration(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        {topic && (
          <div style={{
            background: "rgba(255,107,53,0.04)",
            border: "1px solid rgba(255,107,53,0.15)",
            borderRadius: 16, padding: "20px 24px",
            marginBottom: 32,
            display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,107,53,0.6)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
                Ready to generate
              </div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", fontFamily: "'Instrument Serif', serif" }}>
                "{topic.slice(0, 60)}{topic.length > 60 ? "..." : ""}"
              </div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#ff6b35" }}>{duration}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>Duration</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#ff6b35" }}>{audience}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>Audience</div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="fade-up">
          <button
            className="submit-btn"
            disabled={!topic.trim()}
            onClick={handleSubmit}
          >
            Generate Script & Start Session →
          </button>
          <div style={{
            textAlign: "center", marginTop: 16,
            fontSize: 13, color: "rgba(255,255,255,0.2)",
            fontFamily: "'DM Sans', sans-serif"
          }}>
            Your webcam and microphone will be activated on the next screen
          </div>
        </div>

      </div>
    </div>
  );
}