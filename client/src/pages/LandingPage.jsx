import { useState, useEffect, useRef } from "react";

const floatingWords = ["Confidence","Clarity","Presence","Impact","Fluency","Mastery","Poise","Authority"];

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % floatingWords.length);
        setVisible(true);
      }, 400);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: "🧠", title: "AI Script Generator", desc: "Enter any topic and get a perfectly structured speech in seconds" },
    { icon: "😶", title: "Emotion Detection", desc: "Real-time facial analysis tracks confidence, nervousness & engagement" },
    { icon: "🧍", title: "Posture Analysis", desc: "MediaPipe detects slouching, gestures and eye contact live" },
    { icon: "🎙️", title: "Voice Intelligence", desc: "Counts filler words, measures pace and detects voice stress" },
    { icon: "📊", title: "Coaching Report", desc: "AI generates a detailed personalised improvement plan after each session" },
    { icon: "📈", title: "Progress Tracking", desc: "Watch your scores improve across sessions over time" },
  ];

  const stats = [
    { val: "7+", label: "Emotions Tracked" },
    { val: "Real-time", label: "Live Analysis" },
    { val: "1 API", label: "Claude Powered" },
    { val: "Free", label: "To Get Started" },
  ];

  return (
    <div style={{
      background: "#020008",
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
      color: "#fff",
      overflow: "hidden",
      cursor: "none",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cursor {
          position: fixed;
          width: 12px; height: 12px;
          background: #ff6b35;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: transform 0.1s;
          mix-blend-mode: screen;
        }

        .cursor-ring {
          position: fixed;
          width: 40px; height: 40px;
          border: 1px solid rgba(255,107,53,0.4);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          transition: left 0.12s ease, top 0.12s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes wordFade {
          from { opacity: 0; transform: translateY(10px) skewX(-5deg); }
          to { opacity: 1; transform: translateY(0) skewX(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }

        @keyframes orb {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.1) translate(30px, -20px); }
          66% { transform: scale(0.9) translate(-20px, 30px); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        .hero-text {
          animation: fadeUp 1s ease forwards;
          opacity: 0;
        }

        .hero-text:nth-child(2) { animation-delay: 0.15s; }
        .hero-text:nth-child(3) { animation-delay: 0.3s; }
        .hero-text:nth-child(4) { animation-delay: 0.45s; }
        .hero-text:nth-child(5) { animation-delay: 0.6s; }

        .word-swap {
          display: inline-block;
          transition: opacity 0.4s, transform 0.4s;
        }

        .word-swap.visible {
          animation: wordFade 0.4s ease forwards;
        }

        .feature-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 28px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,107,53,0.05), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .feature-card:hover {
          border-color: rgba(255,107,53,0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(255,107,53,0.08);
        }

        .feature-card:hover::before { opacity: 1; }

        .cta-btn {
          background: linear-gradient(135deg, #ff6b35, #ff2d6b);
          border: none;
          color: #fff;
          padding: 18px 48px;
          border-radius: 100px;
          font-size: 16px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          letter-spacing: 0.3px;
        }

        .cta-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .cta-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 0 60px rgba(255,107,53,0.4);
        }

        .cta-btn:hover::after { opacity: 1; }

        .ghost-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7);
          padding: 18px 48px;
          border-radius: 100px;
          font-size: 16px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ghost-btn:hover {
          border-color: rgba(255,255,255,0.4);
          color: #fff;
        }

        .nav-link {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
          cursor: pointer;
        }

        .nav-link:hover { color: #fff; }

        .gradient-text {
          background: linear-gradient(135deg, #ff6b35 0%, #ff2d6b 50%, #c026d3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .noise {
          position: fixed;
          inset: 0;
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Custom cursor */}
      <div className="cursor" style={{ left: mousePos.x, top: mousePos.y }} />
      <div className="cursor-ring" style={{ left: mousePos.x, top: mousePos.y }} />
      <div className="noise" />

      {/* Background orbs */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", width: 700, height: 700,
          background: "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)",
          top: "-200px", left: "-200px",
          animation: "orb 12s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(255,45,107,0.1) 0%, transparent 70%)",
          bottom: "-100px", right: "-100px",
          animation: "orb 15s ease-in-out infinite reverse",
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400,
          background: "radial-gradient(circle, rgba(192,38,211,0.08) 0%, transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          animation: "orb 10s ease-in-out infinite 2s",
        }} />
      </div>

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0,
        padding: "20px 60px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        zIndex: 100,
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        background: "rgba(2,0,8,0.6)",
      }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, letterSpacing: "-0.5px" }}>
          Loqui<span className="gradient-text">.AI</span>
        </div>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {["Features", "How it works", "Pricing", "About"].map(item => (
            <span key={item} className="nav-link">{item}</span>
          ))}
        </div>
        <button className="cta-btn" style={{ padding: "12px 28px", fontSize: 14 }}>
          Get Started Free
        </button>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "120px 40px 80px",
        position: "relative", zIndex: 2,
      }}>

        {/* Badge */}
        <div className="hero-text" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,107,53,0.08)",
          border: "1px solid rgba(255,107,53,0.2)",
          borderRadius: 100, padding: "8px 18px",
          fontSize: 13, color: "rgba(255,255,255,0.7)",
          marginBottom: 40, letterSpacing: "0.5px"
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff6b35", display: "inline-block" }} />
          Powered by Claude AI · face-api.js · MediaPipe
        </div>

        {/* Main Heading */}
        <h1 className="hero-text" style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(52px, 8vw, 110px)",
          lineHeight: 1.0,
          letterSpacing: "-3px",
          marginBottom: 12,
          fontWeight: 400,
        }}>
          Speak with
        </h1>

        <h1 className="hero-text" style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(52px, 8vw, 110px)",
          lineHeight: 1.0,
          letterSpacing: "-3px",
          marginBottom: 40,
          fontWeight: 400,
        }}>
          <span
            className={`word-swap ${visible ? "visible" : ""}`}
            style={{
              opacity: visible ? 1 : 0,
              background: "linear-gradient(135deg, #ff6b35, #ff2d6b, #c026d3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {floatingWords[wordIndex]}
          </span>
        </h1>

        {/* Subheading */}
        <p className="hero-text" style={{
          fontSize: "clamp(16px, 2vw, 20px)",
          color: "rgba(255,255,255,0.45)",
          maxWidth: 520,
          lineHeight: 1.7,
          marginBottom: 52,
          fontWeight: 300,
        }}>
          Upload a topic. Get an AI-crafted script. Present live.
          Receive real-time analysis of your face, posture, and voice.
          Then get coached by AI.
        </p>

        {/* CTAs */}
        <div className="hero-text" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
          <button className="cta-btn" style={{ fontSize: 16 }}>
            Start Presenting Free →
          </button>
          <button className="ghost-btn">
            Watch Demo
          </button>
        </div>

        {/* Stats row */}
        <div className="hero-text" style={{
          display: "flex", gap: 48, marginTop: 80,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: 40,
          flexWrap: "wrap", justifyContent: "center"
        }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 32, letterSpacing: "-1px",
                background: "linear-gradient(135deg, #ff6b35, #ff2d6b)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>{s.val}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Floating mic visual */}
        <div style={{
          position: "absolute", right: "8%", top: "30%",
          animation: "float 6s ease-in-out infinite",
          opacity: 0.15, fontSize: 120, pointerEvents: "none",
          filter: "blur(1px)"
        }}>🎙️</div>
        <div style={{
          position: "absolute", left: "6%", top: "45%",
          animation: "float 8s ease-in-out infinite 1s",
          opacity: 0.1, fontSize: 80, pointerEvents: "none",
          filter: "blur(1px)"
        }}>📊</div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: "80px 60px 120px",
        position: "relative", zIndex: 2,
        maxWidth: 1200, margin: "0 auto"
      }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            fontSize: 12, letterSpacing: 3, color: "rgba(255,107,53,0.7)",
            textTransform: "uppercase", marginBottom: 16, fontWeight: 500
          }}>What Loqui.AI Does</div>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(36px, 5vw, 60px)",
            letterSpacing: "-2px", fontWeight: 400, lineHeight: 1.1
          }}>
            Everything your{" "}
            <span style={{ fontStyle: "italic" }} className="gradient-text">presentation coach</span>
            {" "}does.<br />Automatically.
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
        }}>
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <div style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 22, marginBottom: 10, letterSpacing: "-0.5px"
              }}>{f.title}</div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, fontWeight: 300 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        padding: "80px 60px",
        textAlign: "center",
        position: "relative", zIndex: 2,
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(255,107,53,0.08), rgba(192,38,211,0.08))",
          border: "1px solid rgba(255,107,53,0.15)",
          borderRadius: 24, padding: "64px 40px",
          maxWidth: 700, margin: "0 auto",
          position: "relative", overflow: "hidden"
        }}>
          {/* Pulse rings */}
          {[1,2,3].map(i => (
            <div key={i} style={{
              position: "absolute", top: "50%", left: "50%",
              width: 200, height: 200,
              border: "1px solid rgba(255,107,53,0.1)",
              borderRadius: "50%",
              transform: "translate(-50%,-50%)",
              animation: `pulse-ring 3s ease-out infinite ${i * 0.8}s`,
              pointerEvents: "none"
            }} />
          ))}
          <div style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            letterSpacing: "-1.5px", marginBottom: 16, fontWeight: 400,
            position: "relative"
          }}>
            Ready to own the room?
          </div>
          <p style={{
            color: "rgba(255,255,255,0.4)", fontSize: 16,
            marginBottom: 36, fontWeight: 300, position: "relative"
          }}>
            Start for free. No credit card. Just better presentations.
          </p>
          <button className="cta-btn" style={{ fontSize: 17, position: "relative" }}>
            Launch Loqui.AI →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "32px 60px",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "relative", zIndex: 2,
        color: "rgba(255,255,255,0.2)", fontSize: 13
      }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18 }}>
          Loqui<span className="gradient-text">.AI</span>
        </div>
        <div>Built with Claude API · face-api.js · MediaPipe · MERN Stack</div>
        <div>© 2025 Loqui.AI</div>
      </footer>
    </div>
  );
}