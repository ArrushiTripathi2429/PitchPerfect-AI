import { useEffect, useRef, useState } from "react";

const steps = [
  {
    num: "01",
    title: "Enter Your Topic",
    desc: "Type any topic or paste your own script. AI structures it into a perfect, timed speech instantly.",
    detail: "Climate Change · Product Launch · College Seminar · Job Interview",
    side: "left"
  },
  {
    num: "02",
    title: "Present on Webcam",
    desc: "Hit record and present naturally. AI simultaneously watches your face, reads your body, and listens to your voice.",
    detail: "Webcam + Microphone · No downloads · Works in browser",
    side: "right"
  },
  {
    num: "03",
    title: "Get Analyzed Live",
    desc: "Real-time graphs update every second — emotion score, posture rating, filler word count, speech pace.",
    detail: "Emotion · Posture · Eye Contact · Voice Pace · Filler Words",
    side: "left"
  },
  {
    num: "04",
    title: "Receive Your Report",
    desc: "After your session, AI generates a full personalised coaching report with specific, actionable tips.",
    detail: "Strengths · Weaknesses · Improvement Plan · Next Session Goals",
    side: "right"
  },
];

export default function HowItWorks({ sectionRef }) {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observers = stepRefs.current.map((ref, i) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSteps(prev => [...new Set([...prev, i])]);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(ref);
      return observer;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  return (
    <section
      id="howitworks"
      ref={sectionRef}
      style={{
        padding: "120px 60px",
        position: "relative",
        zIndex: 2,
        borderTop: "1px solid rgba(255,255,255,0.04)",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes lineGrow {
          from { height: 0; }
          to { height: 100%; }
        }
        .step-left { animation: slideInLeft 0.7s ease forwards; }
        .step-right { animation: slideInRight 0.7s ease forwards; }
        .step-hidden { opacity: 0; }
        .timeline-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 36px;
          transition: border-color 0.3s, box-shadow 0.3s;
          position: relative;
          overflow: hidden;
          max-width: 440px;
        }
        .timeline-card:hover {
          border-color: rgba(255,107,53,0.25);
          box-shadow: 0 0 60px rgba(255,107,53,0.05);
        }
        .timeline-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,107,53,0.4), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .timeline-card:hover::after { opacity: 1; }
        .detail-tag {
          display: inline-block;
          background: rgba(255,107,53,0.08);
          border: 1px solid rgba(255,107,53,0.15);
          border-radius: 100px;
          padding: 4px 12px;
          font-size: 11px;
          color: rgba(255,107,53,0.8);
          margin: 3px;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.3px;
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{
            fontSize: 12, letterSpacing: 3, color: "rgba(255,107,53,0.7)",
            textTransform: "uppercase", marginBottom: 16, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif"
          }}>
            The Process
          </div>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(36px, 5vw, 64px)",
            letterSpacing: "-2px", fontWeight: 400, lineHeight: 1.1,
            color: "#fff"
          }}>
            From topic to{" "}
            <span style={{
              fontStyle: "italic",
              background: "linear-gradient(135deg, #ff6b35, #ff2d6b, #c026d3)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              mastery
            </span>
          </h2>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>

          {/* Center vertical line */}
          <div style={{
            position: "absolute",
            left: "50%", top: 0, bottom: 0,
            width: 1,
            background: "linear-gradient(to bottom, transparent, rgba(255,107,53,0.3), rgba(255,45,107,0.3), transparent)",
            transform: "translateX(-50%)",
            zIndex: 1,
          }} />

          {steps.map((step, i) => (
            <div
              key={i}
              ref={el => stepRefs.current[i] = el}
              className={visibleSteps.includes(i)
                ? (step.side === "left" ? "step-left" : "step-right")
                : "step-hidden"
              }
              style={{
                display: "flex",
                justifyContent: step.side === "left" ? "flex-start" : "flex-end",
                alignItems: "center",
                marginBottom: 60,
                position: "relative",
                gap: 0,
              }}
            >
              {/* Card */}
              <div
                className="timeline-card"
                style={{
                  marginLeft: step.side === "left" ? 0 : "auto",
                  marginRight: step.side === "right" ? 0 : "auto",
                  width: "42%",
                }}
              >
                {/* Step number background */}
                <div style={{
                  position: "absolute",
                  top: -20, right: 20,
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 80,
                  color: "rgba(255,107,53,0.04)",
                  lineHeight: 1,
                  pointerEvents: "none",
                  userSelect: "none",
                }}>
                  {step.num}
                </div>

                {/* Step badge */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  marginBottom: 16,
                }}>
                  <div style={{
                    width: 28, height: 28,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff6b35, #ff2d6b)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: "#fff",
                    fontFamily: "'DM Sans', sans-serif",
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{
                    fontSize: 11, letterSpacing: 2,
                    color: "rgba(255,107,53,0.6)",
                    textTransform: "uppercase",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                  }}>
                    Step {step.num}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 26, letterSpacing: "-0.5px",
                  color: "#fff", marginBottom: 12, fontWeight: 400,
                }}>
                  {step.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: 15, color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.7, fontWeight: 300,
                  fontFamily: "'DM Sans', sans-serif",
                  marginBottom: 20,
                }}>
                  {step.desc}
                </p>

                {/* Detail tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {step.detail.split(" · ").map((tag, j) => (
                    <span key={j} className="detail-tag">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Center dot */}
              <div style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                width: 14, height: 14,
                borderRadius: "50%",
                background: visibleSteps.includes(i)
                  ? "linear-gradient(135deg, #ff6b35, #ff2d6b)"
                  : "rgba(255,255,255,0.1)",
                border: "2px solid #020008",
                zIndex: 2,
                boxShadow: visibleSteps.includes(i)
                  ? "0 0 20px rgba(255,107,53,0.5)"
                  : "none",
                transition: "all 0.5s ease",
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}