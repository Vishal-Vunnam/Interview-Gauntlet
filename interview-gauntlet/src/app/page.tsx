"use client";
import Link from "next/link";

export default function InterviewGauntletWelcome() {

  const title = "Welcome to Interview Gauntlet";
  const subtitle = "Prepare yourself: in the next 15 minutes, you'll face a rapid-fire series of interview challenges.";
  const charCount = title.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#eee",
        fontFamily: "'Courier New', Courier, monospace",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 1rem",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          borderRight: "2px solid #eee",
          whiteSpace: "nowrap",
          overflow: "hidden",
          width: `${charCount}ch`,
          animation: `typing 2.5s steps(${charCount}) forwards, blink 0.35s step-end infinite`,
        }}
      >
        {title}
      </h1>



      <Link
        href="/introduction"
        style={{
          backgroundColor: "#222",
          color: "#eee",
          padding: "0.75rem 2rem",
          borderRadius: "6px",
          fontWeight: "600",
          fontSize: "1.1rem",
          textDecoration: "none",
          marginTop: "2rem",
          border: "1px solid #444",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#444")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#222")}
      >
        Continue
      </Link>

      <style jsx>{`
        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: ${charCount}ch;
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
