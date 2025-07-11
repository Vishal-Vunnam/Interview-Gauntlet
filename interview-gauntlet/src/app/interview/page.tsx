import Link from "next/link";

export default function InterviewPage() {
  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Interview Page</h2>
      <p>This is where your interview will take place.</p>
      <Link href="/" style={{ display: "inline-block", marginTop: 20, color: "#0070f3" }}>
        Back to Welcome
      </Link>
    </div>
  );
} 