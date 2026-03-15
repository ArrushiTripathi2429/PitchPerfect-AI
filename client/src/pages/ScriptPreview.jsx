import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";

export default function ScriptPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, audience, duration } = location.state || {};

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const detectionInterval = useRef(null);
  const poseIntervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const voiceCrackIntervalRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const prevVolumeRef = useRef(0);

  const [script, setScript] = useState("");
  const [loadingScript, setLoadingScript] = useState(true);
  const [dots, setDots] = useState(".");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [emotionScores, setEmotionScores] = useState({});
  const [fillerCount, setFillerCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [postureScore, setPostureScore] = useState(100);
  const [voiceCracks, setVoiceCracks] = useState(0);
  const [eyeContact, setEyeContact] = useState(true);

  const FILLER_WORDS = [
    "um",
    "uh",
    "like",
    "you know",
    "basically",
    "actually",
    "literally",
    "so",
    "right",
  ];

  const emotionColors = {
    happy: "#34C759",
    neutral: "#4FC3F7",
    sad: "#5E6AD2",
    angry: "#FF2D55",
    fearful: "#FF9500",
    disgusted: "#AF52DE",
    surprised: "#FFB800",
  };

  useEffect(() => {
    if (!topic) {
      navigate("/upload-topic");
      return;
    }
    generateScript();
    loadModels();
    setTimeout(() => setupCamera(), 500);
    return () => cleanup();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;
    if (isPresenting) {
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPresenting]);

  useEffect(() => {
    if (seconds > 0 && wordCount > 0) {
      setWpm(Math.round((wordCount / seconds) * 60));
    }
  }, [seconds, wordCount]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  async function generateScript() {
    setLoadingScript(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/script`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, audience, duration }),
        },
      );
      const data = await res.json();
      setScript(data.script);
    } catch (e) {
      setScript("Error generating script. Please go back and try again.");
    }
    setLoadingScript(false);
  }

  async function loadModels() {
    try {
      const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    } catch (e) {
      console.error("Model load failed:", e);
      setModelsLoaded(true);
    }
  }


async function loadMediaPipe() {
  try {
    const { PoseLandmarker, FilesetResolver } =
      await import("@mediapipe/tasks-vision");
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    );
    poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numPoses: 1,
    });
  } catch (e) {
    console.error("MediaPipe load error:", e);
  }
}


async function setupCamera() {
  if (videoRef.current?.srcObject) {
    videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    videoRef.current.srcObject = null;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480, facingMode: "user" },
      audio: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;

      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = resolve;
        setTimeout(resolve, 2000);
      });

      videoRef.current.play();
      setCameraReady(true);
    }

    setupVoiceCrackDetection(stream);

  } catch (e) {
    console.error("Camera error:", e);
    setCameraReady(true);
  }
}

function setupVoiceCrackDetection(stream) {
  try {
    audioContextRef.current = new AudioContext();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;
    source.connect(analyserRef.current);
  } catch (e) {
    console.error("Audio setup error:", e);
  }
}
function setupVoiceCrackDetection(stream) {
  try {
    audioContextRef.current = new AudioContext();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;
    source.connect(analyserRef.current);
  } catch (e) {
    console.error("Audio setup error:", e);
  }
}

function startVoiceCrackDetection() {
  if (!analyserRef.current) return;
  const dataArray = new Float32Array(analyserRef.current.fftSize);
  voiceCrackIntervalRef.current = setInterval(() => {
    analyserRef.current.getFloatTimeDomainData(dataArray);
    const rms = Math.sqrt(
      dataArray.reduce((s, v) => s + v * v, 0) / dataArray.length,
    );
    const volume = rms * 100;
    if (prevVolumeRef.current > 15 && volume < 3) {
      setVoiceCracks((v) => v + 1);
    }
    prevVolumeRef.current = volume;
  }, 100);
}

function startPostureDetection() {
  if (!poseLandmarkerRef.current) return;
  poseIntervalRef.current = setInterval(async () => {
    if (!videoRef.current) return;
    try {
      const result = poseLandmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now(),
      );
      if (result.landmarks && result.landmarks.length > 0) {
        analyzePosture(result.landmarks[0]);
      }
    } catch (e) {}
  }, 500);
}

function analyzePosture(landmarks) {
  const nose = landmarks[0];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftEar = landmarks[7];
  const rightEar = landmarks[8];

  let score = 100;
  if (Math.abs(leftShoulder.y - rightShoulder.y) > 0.05) score -= 25;
  if (Math.abs(leftEar.y - rightEar.y) > 0.05) score -= 25;
  if (nose.x < 0.25 || nose.x > 0.75) score -= 25;
  const lookingDown = nose.y > 0.6;
  setEyeContact(!lookingDown);
  if (lookingDown) score -= 25;
  setPostureScore(Math.max(score, 0));
}

function cleanup() {
  if (detectionInterval.current) clearInterval(detectionInterval.current);
  if (poseIntervalRef.current) clearInterval(poseIntervalRef.current);
  if (voiceCrackIntervalRef.current)
    clearInterval(voiceCrackIntervalRef.current);
  if (recognitionRef.current) recognitionRef.current.stop();

  if (audioContextRef.current && audioContextRef.current.state !== "closed") {
    audioContextRef.current.close();
  }

  if (videoRef.current?.srcObject) {
    videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
  }
}
async function startPresenting() {
  setIsPresenting(true);
  await loadMediaPipe();
  startEmotionDetection();
  startSpeechRecognition();
  startPostureDetection();
  startVoiceCrackDetection();
}

function startEmotionDetection() {
  if (!modelsLoaded) {
    const wait = setInterval(() => {
      if (modelsLoaded) {
        clearInterval(wait);
        beginDetection();
      }
    }, 500);
    return;
  }
  beginDetection();
}

function beginDetection() {
  detectionInterval.current = setInterval(async () => {
    if (!videoRef.current) return;
    try {
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions(),
        )
        .withFaceExpressions();
      if (detection) {
        const expr = detection.expressions;
        setEmotionScores(expr);
        const top = Object.entries(expr).sort((a, b) => b[1] - a[1])[0];
        setCurrentEmotion(top[0]);
      }
    } catch (e) {}
  }, 1000);
}

function startSpeechRecognition() {
  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    console.log("Speech Recognition not supported");
    return;
  }
  console.log("Speech Recognition starting...");

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onstart = () => console.log("Mic is listening");
  recognition.onerror = (e) => console.log("Speech error:", e.error);
  recognition.onresult = (e) => {
    console.log("Heard something:", e.results);
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) {
        const words = t.trim().split(/\s+/);
        setWordCount((w) => w + words.length);
        const fillers = words.filter((w) =>
          FILLER_WORDS.includes(w.toLowerCase().replace(/[^a-z]/g, "")),
        );
        setFillerCount((f) => f + fillers.length);
        setTranscript((prev) => prev + " " + t);
      }
    }
  };

  recognition.start();
  recognitionRef.current = recognition;
}

function stopSession() {
  setIsPresenting(false);
  cleanup();
  navigate("/report", {
    state: {
      topic,
      script,
      audience,
      duration,
      seconds,
      wordCount,
      wpm,
      fillerCount,
      transcript,
      emotionScores,
      currentEmotion,
      postureScore,
      voiceCracks,
      eyeContact,
    },
  });
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const emotionColor = emotionColors[currentEmotion] || "#4FC3F7";

const wordCountScript = script ? script.split(" ").filter(Boolean).length : 0;
const estimatedTime = script ? Math.ceil(wordCountScript / 130) : 0;

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
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes orb {
          0%, 100% { transform: scale(1) translate(0,0); }
          50% { transform: scale(1.1) translate(20px,-20px); }
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .gradient-text {
          background: linear-gradient(135deg, #ff6b35 0%, #ff2d6b 50%, #c026d3 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; padding: 16px;
          text-align: center;
        }
        .script-textarea {
          width: 100%; background: transparent;
          border: none; outline: none;
          color: rgba(255,255,255,0.8);
          font-family: 'Georgia', serif;
          font-size: 16px; line-height: 2;
          resize: none; min-height: 220px;
        }
        .action-btn {
          padding: 16px 40px; border-radius: 100px;
          font-size: 15px; font-family: 'DM Sans', sans-serif;
          font-weight: 500; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          border: none;
        }
        .start-btn {
          background: linear-gradient(135deg, #ff6b35, #ff2d6b);
          color: #fff; position: relative; overflow: hidden;
        }
        .start-btn::after {
          content: ''; position: absolute;
          top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: shimmer 2.5s infinite;
        }
        .start-btn:hover { transform: scale(1.04); box-shadow: 0 0 40px rgba(255,107,53,0.4); }
        .start-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; box-shadow: none; }
        .stop-btn {
          background: linear-gradient(135deg, #FF2D55, #ff6b35);
          color: #fff;
        }
        .stop-btn:hover { transform: scale(1.04); box-shadow: 0 0 40px rgba(255,45,85,0.4); }
        .back-btn {
          background: none; border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.4); padding: 10px 20px;
          border-radius: 100px; font-size: 13px;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .back-btn:hover { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.7); }
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
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(255,107,53,0.09) 0%, transparent 70%)",
          top: "-150px",
          right: "-150px",
          animation: "orb 12s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(192,38,211,0.07) 0%, transparent 70%)",
          bottom: "-100px",
          left: "-100px",
          animation: "orb 15s ease-in-out infinite reverse",
        }}
      />
    </div>

    {/* Navbar */}
    <nav
      style={{
        padding: "16px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        background: "rgba(2,0,8,0.7)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20 }}>
        PitchPerfect<span className="gradient-text">.AI</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isPresenting && (
          <>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#FF2D55",
                animation: "pulse 1s infinite",
              }}
            />
            <span
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "monospace",
              }}
            >
              LIVE — {formatTime(seconds)}
            </span>
          </>
        )}
      </div>
      <button className="back-btn" onClick={() => navigate("/upload-topic")}>
        ← Back
      </button>
    </nav>

    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "48px 40px 100px",
        position: "relative",
        zIndex: 2,
      }}
    >
      {loadingScript ? (
        <div style={{ textAlign: "center", paddingTop: 100 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "2px solid rgba(255,107,53,0.2)",
              borderTop: "2px solid #ff6b35",
              animation: "spin 1s linear infinite",
              margin: "0 auto 28px",
            }}
          />
          <h2
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 36,
              letterSpacing: "-1px",
              fontWeight: 400,
              marginBottom: 10,
            }}
          >
            Crafting your script{dots}
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.3)",
              fontWeight: 300,
            }}
          >
            Writing a {duration} speech on "{topic}"
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* LEFT — Script */}
          <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 3,
                  color: "rgba(255,107,53,0.7)",
                  textTransform: "uppercase",
                  marginBottom: 10,
                  fontWeight: 500,
                }}
              >
                Your Script
              </div>
              <h2
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(22px, 3vw, 32px)",
                  letterSpacing: "-1px",
                  fontWeight: 400,
                  marginBottom: 12,
                }}
              >
                {topic}
              </h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  audience,
                  `${wordCountScript} words`,
                  `~${estimatedTime} min`,
                ].map((pill, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 12,
                      padding: "5px 14px",
                      background: "rgba(255,107,53,0.08)",
                      border: "1px solid rgba(255,107,53,0.15)",
                      borderRadius: 100,
                      color: "rgba(255,107,53,0.8)",
                    }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 18,
                padding: "28px 32px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,107,53,0.3), transparent)",
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 2,
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Edit if needed
              </div>
              <textarea
                className="script-textarea"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={16}
              />
            </div>
          </div>

          {/* RIGHT — Webcam + Stats */}
          <div style={{ animation: "fadeUp 0.6s ease forwards" }}>
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 3,
                  color: "rgba(255,107,53,0.7)",
                  textTransform: "uppercase",
                  marginBottom: 10,
                  fontWeight: 500,
                }}
              >
                Live Practice
              </div>
              <h2
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(22px, 3vw, 32px)",
                  letterSpacing: "-1px",
                  fontWeight: 400,
                }}
              >
                {isPresenting ? "You're live" : "Ready when you are"}
              </h2>
            </div>

            {/* Webcam */}
            <div
              style={{
                borderRadius: 18,
                overflow: "hidden",
                border: `2px solid ${isPresenting ? emotionColor + "50" : "rgba(255,255,255,0.06)"}`,
                background: "#080810",
                transition: "border-color 0.5s",
                aspectRatio: "4/3",
                position: "relative",
                marginBottom: 16,
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {isPresenting && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: "rgba(0,0,0,0.65)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${emotionColor}40`,
                    borderRadius: 100,
                    padding: "5px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: emotionColor,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      color: emotionColor,
                      textTransform: "capitalize",
                      fontWeight: 500,
                    }}
                  >
                    {currentEmotion}
                  </span>
                </div>
              )}

              {isPresenting && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    background: "rgba(0,0,0,0.65)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${eyeContact ? "#34C75940" : "#FF2D5540"}`,
                    borderRadius: 100,
                    padding: "5px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: eyeContact ? "#34C759" : "#FF2D55",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      color: eyeContact ? "#34C759" : "#FF2D55",
                      fontWeight: 500,
                    }}
                  >
                    {eyeContact ? "Eye contact ✓" : "Look up!"}
                  </span>
                </div>
              )}

              {isPresenting && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: "rgba(0,0,0,0.65)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,45,85,0.3)",
                    borderRadius: 100,
                    padding: "5px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#FF2D55",
                      animation: "pulse 1s infinite",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      color: "#FF2D55",
                      fontFamily: "monospace",
                    }}
                  >
                    {formatTime(seconds)}
                  </span>
                </div>
              )}

              {isPresenting && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    background: "rgba(0,0,0,0.65)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${postureScore > 80 ? "#34C75940" : postureScore > 50 ? "#FFB80040" : "#FF2D5540"}`,
                    borderRadius: 100,
                    padding: "5px 12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color:
                        postureScore > 80
                          ? "#34C759"
                          : postureScore > 50
                            ? "#FFB800"
                            : "#FF2D55",
                      fontWeight: 500,
                    }}
                  >
                    Posture {postureScore}%
                  </span>
                </div>
              )}

              {!cameraReady && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,107,53,0.2)",
                      borderTop: "2px solid #ff6b35",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                </div>
              )}

              {cameraReady && !isPresenting && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(2,0,8,0.5)",
                    backdropFilter: "blur(2px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                    Camera ready
                  </div>
                </div>
              )}
            </div>

            {/* Stats grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <div className="stat-card">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 1,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  WPM
                </div>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 26,
                    color:
                      wpm > 170
                        ? "#FF2D55"
                        : wpm > 120
                          ? "#34C759"
                          : wpm > 0
                            ? "#FFB800"
                            : "rgba(255,255,255,0.3)",
                  }}
                >
                  {wpm || "--"}
                </div>
              </div>
              <div className="stat-card">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 1,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Fillers
                </div>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 26,
                    color:
                      fillerCount > 10
                        ? "#FF2D55"
                        : fillerCount > 5
                          ? "#FFB800"
                          : "#34C759",
                  }}
                >
                  {fillerCount}
                </div>
              </div>
              <div className="stat-card">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 1,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Words
                </div>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 26,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {wordCount}
                </div>
              </div>
              <div className="stat-card">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 1,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Posture
                </div>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 26,
                    color:
                      postureScore > 80
                        ? "#34C759"
                        : postureScore > 50
                          ? "#FFB800"
                          : "#FF2D55",
                  }}
                >
                  {isPresenting ? `${postureScore}%` : "--"}
                </div>
              </div>
              <div className="stat-card">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 1,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  V.Cracks
                </div>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 26,
                    color:
                      voiceCracks > 5
                        ? "#FF2D55"
                        : voiceCracks > 2
                          ? "#FFB800"
                          : "#34C759",
                  }}
                >
                  {voiceCracks}
                </div>
              </div>
              <div className="stat-card">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 1,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Eye
                </div>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 26,
                    color: eyeContact ? "#34C759" : "#FF2D55",
                  }}
                >
                  {isPresenting ? (eyeContact ? "✓" : "✗") : "--"}
                </div>
              </div>
            </div>

            {!isPresenting ? (
              <button
                className="action-btn start-btn"
                style={{ width: "100%" }}
                disabled={!cameraReady}
                onClick={startPresenting}
              >
                {cameraReady ? "Start Presenting →" : "Loading camera..."}
              </button>
            ) : (
              <button
                className="action-btn stop-btn"
                style={{ width: "100%" }}
                onClick={stopSession}
              >
                Stop & Get Report →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);
}