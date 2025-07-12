"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const questions = [
  "What is your name?",
  "What job are you interviewing for?",
  "What are your strengths in interviews?",
  "What are your weaknesses in interviews?",
];

export default function IntroductionPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    job: "",
    strengths: "",
    weaknesses: "",
  });

  const router = useRouter();

  // Typing animation logic
  useEffect(() => {
    const question = questions[currentQuestion];
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(question.slice(0, i + 1));
      i++;
      if (i >= question.length) clearInterval(interval);
    }, 40); // typing speed

    return () => clearInterval(interval);
  }, [currentQuestion]);

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentQuestion < 3) {
      setCurrentQuestion(currentQuestion + 1);
      setTypedText("");
    } else {
      const params = new URLSearchParams(formData).toString();
      router.push(`/interview?${params}`);
    }
  };

  const fieldKeys: (keyof typeof formData)[] = ["name", "job", "strengths", "weaknesses"];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#eee",
        fontFamily: "'Courier New', monospace",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 1rem",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          borderRight: "2px solid #eee",
          whiteSpace: "nowrap",
          overflow: "hidden",
          width: `${questions[currentQuestion].length + 1}ch`,
          animation: "typing 2s steps(40), blink 1s step-end infinite",
        }}
      >
        {typedText}
      </h2>

      <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
        <input
          type="text"
          value={formData[fieldKeys[currentQuestion]]}
          onChange={handleChange(fieldKeys[currentQuestion])}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "1rem",
            fontFamily: "'Courier New', monospace",
            backgroundColor: "#111",
            color: "#eee",
            border: "1px solid #333",
            borderRadius: "4px",
          }}
          autoFocus
          required
        />
        <button
          type="submit"
          style={{
            marginTop: "1rem",
            padding: "10px 20px",
            fontSize: "1rem",
            fontFamily: "'Courier New', monospace",
            backgroundColor: "#222",
            color: "#eee",
            border: "1px solid #444",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {currentQuestion < 3 ? "Next" : "Start Interview"}
        </button>
      </form>

      <style jsx>{`
        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes blink {
          50% {
            border-color: transparent;
          }
        }
      `}</style>
    </div>
  );
}
