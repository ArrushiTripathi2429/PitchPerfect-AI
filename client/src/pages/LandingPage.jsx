import { useState, useEffect, useRef } from "react";
import TextRevealCard from "./TextRevealCardTitle";
import HowItWorks from "../components/HowItWorks";
import { SparklesPreview } from "../pages/SparklesPreview";
import { SignInButton, SignOutButton, useUser, useClerk } from "@clerk/react";
import { useNavigate } from "react-router-dom";

const floatingWords = [
  "Confidence",
  "Clarity",
  "Presence",
  "Impact",
  "Fluency",
  "Mastery",
  "Poise",
  "Authority",
];

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  const homeRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const aboutRef = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 },
    );
    [homeRef, featuresRef, howItWorksRef, aboutRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navItems = [
    { label: "Features", ref: featuresRef, id: "features" },
    { label: "How it works", ref: howItWorksRef, id: "howitworks" },
    { label: "About", ref: aboutRef, id: "about" },
  ];

  const features = [
    {
      icon: "✦",
      title: "AI Script Generator",
      desc: "Enter any topic and get a perfectly structured speech in seconds",
    },
    {
      icon: "◈",
      title: "Emotion Detection",
      desc: "Real-time facial analysis tracks confidence, nervousness & engagement",
    },
    {
      icon: "⬡",
      title: "Posture Analysis",
      desc: "Detects slouching, gestures and eye contact live via your webcam",
    },
    {
      icon: "◎",
      title: "Voice Intelligence",
      desc: "Counts filler words, measures pace and detects voice stress patterns",
    },
    {
      icon: "◇",
      title: "Coaching Report",
      desc: "Get a detailed personalised improvement plan after every session",
    },
    {
      icon: "△",
      title: "Progress Tracking",
      desc: "Watch your scores improve across sessions over time",
    },
  ];

  const stats = [
    { val: "7+", label: "Emotions Tracked" },
    { val: "Real-time", label: "Live Analysis" },
    { val: "AI", label: "Script Generation" },
    { val: "Free", label: "To Get Started" },
  ];

  return (
    <div
      style={{
        background: "#020008",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .cursor {
          position: fixed; width: 12px; height: 12px;
          background: #ff6b35; border-radius: 50%;
          pointer-events: none; z-index: 9999;
          transform: translate(-50%, -50%); mix-blend-mode: screen;
        }
        .cursor-ring {
          position: fixed; width: 40px; height: 40px;
          border: 1px solid rgba(255,107,53,0.4); border-radius: 50%;
          pointer-events: none; z-index: 9998;
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
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes orb {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.1) translate(30px, -20px); }
          66% { transform: scale(0.9) translate(-20px, 30px); }
        }
        .hero-text { animation: fadeUp 1s ease forwards; opacity: 0; }
        .hero-text:nth-child(2) { animation-delay: 0.15s; }
        .hero-text:nth-child(3) { animation-delay: 0.3s; }
        .hero-text:nth-child(4) { animation-delay: 0.45s; }
        .hero-text:nth-child(5) { animation-delay: 0.6s; }
        .word-swap { display: inline-block; }
        .word-swap.visible { animation: wordFade 0.4s ease forwards; }
        .feature-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 28px;
          transition: all 0.3s ease; position: relative; overflow: hidden;
        }
        .feature-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,107,53,0.05), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .feature-card:hover {
          border-color: rgba(255,107,53,0.3); transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(255,107,53,0.08);
        }
        .feature-card:hover::before { opacity: 1; }
        .cta-btn {
          background: linear-gradient(135deg, #ff6b35, #ff2d6b);
          border: none; color: #fff; padding: 18px 48px;
          border-radius: 100px; font-size: 16px;
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          cursor: pointer !important; position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s; letter-spacing: 0.3px;
          pointer-events: all !important;
        }
        .cta-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 0 60px rgba(255,107,53,0.4);
        }
        .nav-link {
          color: rgba(255,255,255,0.5); font-size: 14px;
          transition: color 0.2s; cursor: pointer !important;
          background: none; border: none;
          font-family: 'DM Sans', sans-serif;
          padding: 6px 0; position: relative;
          pointer-events: all !important;
        }
        .nav-link::after {
          content: ''; position: absolute;
          bottom: 0; left: 0; width: 0; height: 1px;
          background: #ff6b35; transition: width 0.3s;
        }
        .nav-link:hover { color: #fff; }
        .nav-link:hover::after { width: 100%; }
        .nav-link.active { color: #ff6b35; }
        .nav-link.active::after { width: 100%; }
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

      <div
        className="cursor"
        style={{ left: mousePos.x, top: mousePos.y, pointerEvents: "none" }}
      />
      <div
        className="cursor-ring"
        style={{ left: mousePos.x, top: mousePos.y, pointerEvents: "none" }}
      />
      <div className="noise" />

      {/* Background orbs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)",
            top: "-200px",
            left: "-200px",
            animation: "orb 12s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(255,45,107,0.1) 0%, transparent 70%)",
            bottom: "-100px",
            right: "-100px",
            animation: "orb 15s ease-in-out infinite reverse",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(192,38,211,0.08) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            animation: "orb 10s ease-in-out infinite 2s",
          }}
        />
      </div>

      {/* Navbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "20px 60px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100,
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          background: "rgba(2,0,8,0.6)",
        }}
      >
        <div
          onClick={() => scrollTo(homeRef)}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 22,
            letterSpacing: "-0.5px",
            cursor: "pointer",
          }}
        >
          PitchPerfect<span className="gradient-text">.AI</span>
        </div>

        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.ref)}
              className={`nav-link ${activeSection === item.id ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {isSignedIn ? (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              className="cta-btn"
              style={{ padding: "12px 28px", fontSize: 14 }}
              onClick={() => navigate("/upload-topic")}
            >
              Dashboard
            </button>
            <SignOutButton>
              <button
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.5)",
                  padding: "12px 20px",
                  borderRadius: 100,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Logout
              </button>
            </SignOutButton>
          </div>
        ) : (
          <SignInButton mode="modal" forceRedirectUrl="/upload-topic">
            <button
              className="cta-btn"
              style={{ padding: "12px 28px", fontSize: 14 }}
            >
              Get Started Free
            </button>
          </SignInButton>
        )}
      </nav>

      {/* HERO SECTION */}
      <section
        id="home"
        ref={homeRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 40px 80px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="hero-text"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,107,53,0.08)",
            border: "1px solid rgba(255,107,53,0.2)",
            borderRadius: 100,
            padding: "8px 18px",
            fontSize: 13,
            color: "rgba(255,255,255,0.7)",
            marginBottom: 40,
            letterSpacing: "0.5px",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#ff6b35",
              display: "inline-block",
            }}
          />
          AI-Powered Presentation Coach — Real-time Analysis
        </div>

        <h1
          className="hero-text"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(52px, 8vw, 110px)",
            lineHeight: 1.0,
            letterSpacing: "-3px",
            marginBottom: 12,
            fontWeight: 400,
          }}
        >
          Speak with
        </h1>

        <h1
          className="hero-text"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(52px, 8vw, 110px)",
            lineHeight: 1.0,
            letterSpacing: "-3px",
            marginBottom: 40,
            fontWeight: 400,
          }}
        >
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

        <SparklesPreview />

        <p
          className="hero-text"
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "rgba(255,255,255,0.45)",
            maxWidth: 520,
            lineHeight: 1.7,
            marginBottom: 52,
            fontWeight: 300,
          }}
        >
          Upload a topic. Get an AI-crafted script. Present live. Receive
          real-time analysis of your face, posture, and voice. Then get coached
          by AI.
        </p>

        <div className="hero-text">
          {isSignedIn ? (
            <button
              className="cta-btn"
              style={{ fontSize: 17 }}
              onClick={() => navigate("/upload-topic")}
            >
              Start Generating →
            </button>
          ) : (
            <SignInButton mode="modal" forceRedirectUrl="/upload-topic">
              <button className="cta-btn" style={{ fontSize: 17 }}>
                Get Started →
              </button>
            </SignInButton>
          )}
        </div>

        <div
          className="hero-text"
          style={{
            display: "flex",
            gap: 48,
            marginTop: 80,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 40,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 32,
                  letterSpacing: "-1px",
                  background: "linear-gradient(135deg, #ff6b35, #ff2d6b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.35)",
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <TextRevealCard />

      {/* FEATURES SECTION */}
      <section
        id="features"
        ref={featuresRef}
        style={{
          padding: "100px 60px",
          position: "relative",
          zIndex: 2,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 3,
              color: "rgba(255,107,53,0.7)",
              textTransform: "uppercase",
              marginBottom: 16,
              fontWeight: 500,
            }}
          >
            What PitchPerfect.AI Does
          </div>
          <h2
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(36px, 5vw, 60px)",
              letterSpacing: "-2px",
              fontWeight: 400,
              lineHeight: 1.1,
            }}
          >
            Everything your{" "}
            <span style={{ fontStyle: "italic" }} className="gradient-text">
              presentation coach
            </span>{" "}
            does.
            <br />
            Automatically.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div
                style={{
                  fontSize: 24,
                  marginBottom: 16,
                  color: "#ff6b35",
                  fontWeight: 300,
                }}
              >
                {f.icon}
              </div>
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 22,
                  marginBottom: 10,
                  letterSpacing: "-0.5px",
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      <HowItWorks sectionRef={howItWorksRef} />

      {/* ABOUT SECTION */}
      <section
        id="about"
        ref={aboutRef}
        style={{
          padding: "100px 60px",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 3,
              color: "rgba(255,107,53,0.7)",
              textTransform: "uppercase",
              marginBottom: 16,
              fontWeight: 500,
            }}
          >
            About
          </div>
          <h2
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(32px, 4vw, 52px)",
              letterSpacing: "-2px",
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: 24,
            }}
          >
            Built for anyone who wants to{" "}
            <span className="gradient-text" style={{ fontStyle: "italic" }}>
              speak better
            </span>
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.9,
              fontWeight: 300,
              marginBottom: 24,
            }}
          >
            PitchPerfect.AI combines real-time computer vision, speech
            recognition, and generative AI to give you the kind of feedback that
            used to require a personal coach. Whether you're preparing for a job
            interview, a college presentation, or a big pitch — PitchPerfect.AI
            helps you walk in ready.
          </p>
          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.9,
              fontWeight: 300,
              marginBottom: 48,
            }}
          >
            Built with React, Node.js, MongoDB, face-api.js, MediaPipe, and Web
            Speech API.Just better
            presentations.
          </p>

          {isSignedIn ? (
            <button
              className="cta-btn"
              style={{ fontSize: 17 }}
              onClick={() => signOut(() => navigate("/"))}
            >
              Sign Out →
            </button>
          ) : (
            <SignInButton mode="modal" forceRedirectUrl="/upload-topic">
              <button className="cta-btn" style={{ fontSize: 17 }}>
                Get Started →
              </button>
            </SignInButton>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "32px 60px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
          color: "rgba(255,255,255,0.2)",
          fontSize: 13,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18 }}>
          PitchPerfect<span className="gradient-text">.AI</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.ref)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.2)",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div>© 2025 PitchPerfect.AI</div>
      </footer>
    </div>
  );
}
