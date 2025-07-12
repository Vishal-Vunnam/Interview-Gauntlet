'use client'
import Link from "next/link";
import { useEffect, useState} from "react";

import { useSearchParams } from "next/navigation";

export default function InterviewPage() {
    const searchParams = useSearchParams();

    // Parse introduction info from query string
    const clientName = searchParams.get("name") || "";
    const clientJob = searchParams.get("job") || "";
    const clientStrengths = searchParams.get("strengths") || "";
    const clientWeaknesses = searchParams.get("weaknesses") || "";
    let parsedLines = [];
    // useEffect(() => {
    //   // Example: Call OpenAI API on load
    //   const prompt = `
    //     You're an interviewer preparing questions for ${clientName}, who's applying for a ${clientJob} role.
    //     Their strengths: ${clientStrengths}
    //     Their weaknesses: ${clientWeaknesses}

    //     Return output with each part an each question on a new line ('\\n'):
    //     - Brief intro as the interviewer
    //     - 3–4 behavioral questions 
    //     - 3–4 technical questions (specific to the role)
    //     - Closing statement
    //   `;

    //   // Example output from OpenAI (for demonstration)
    //   const exampleOutput = `Hello, I'm your interviewer for today.\\nCan you tell me about a time you overcame a challenge?\\nDescribe a situation where you worked in a team.\\nHow do you handle tight deadlines?\\nWhat excites you about this role?\\nExplain a technical concept related to ${clientJob}.\\nWalk me through a recent project you worked on.\\nHow would you solve problem X in this field?\\nWhat tools or technologies are you most comfortable with?\\nThank you for your responses. Let's begin!`;

    //   // Parse the output based on '\n'
    //   // Replace escaped '\\n' with real newlines, then split
    //   const parsedLines = exampleOutput.replace(/\\n/g, '\n').split('\n');
    //   console.log("Parsed interview output:", parsedLines);

    //   // In real usage, you would fetch from OpenAI and parse the response:
    //   // const fetchOpenAI = async () => {
    //   //   try {
    //   //     const response = await fetch("/api/openai", {
    //   //       method: "POST",
    //   //       headers: {
    //   //         "Content-Type": "application/json",
    //   //       },
    //   //       body: JSON.stringify({
    //   //         prompt,
    //   //       }),
    //   //     });
    //   //     const data = await response.json();
    //   //     // Assume data.output contains the OpenAI string with '\\n'
    //   //     const parsedLines = data.output.replace(/\\n/g, '\n').split('\n');
    //   //     console.log("Parsed interview output:", parsedLines);
    //   //   } catch (error) {
    //   //     console.error("Error calling OpenAI API:", error);
    //   //   }
    //   // };

    //   // fetchOpenAI();
    // }, []);
  const [started, setStarted] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [allLines, setAllLines] = useState<string[]>([]);
  const [recognition, setRecognition] = useState<any>(null);

  // On mount, set parsedLines to state
  useEffect(() => {
    // Use the exampleOutput parsing from above
    const exampleOutput = `Hello, I'm your interviewer for today.\nCan you tell me about a time you overcame a challenge?\nDescribe a situation where you worked in a team.\nHow do you handle tight deadlines?\nWhat excites you about this role?\nExplain a technical concept related to ${clientJob}.\nWalk me through a recent project you worked on.\nHow would you solve problem X in this field?\nWhat tools or technologies are you most comfortable with?\nThank you for your responses. Let's begin!`;
    const parsed = exampleOutput.replace(/\\n/g, '\n').split('\n');
    setAllLines(parsed);
  }, []);

  // Typing effect for each line
  useEffect(() => {
    if (!started || !allLines.length) return;
    setTypedText("");
    setIsTyping(true);
    const line = allLines[currentLine] || "";
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(line.slice(0, i + 1));
      i++;
      if (i >= line.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [started, currentLine, allLines]);

  // Microphone logic (Web Speech API)
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    setIsListening(true);
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const newRecognition = new SpeechRecognition();
    newRecognition.lang = "en-US";
    newRecognition.interimResults = false;
    newRecognition.maxAlternatives = 1;

    newRecognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserResponses((prev) => {
        const updated = [...prev];
        updated[currentLine] = transcript;
        return updated;
      });
      setIsListening(false);
    };

    newRecognition.onerror = () => {
      setIsListening(false);
      alert("Speech recognition error. Please try again.");
    };

    newRecognition.onend = () => {
      setIsListening(false);
    };

    setRecognition(newRecognition);
    newRecognition.start();
  };

  const handleDone = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const handleRedo = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
    // Clear the current response
    setUserResponses((prev) => {
      const updated = [...prev];
      updated[currentLine] = "";
      return updated;
    });
  };

  const handleNext = () => {
    if (currentLine < allLines.length - 1) {
      setCurrentLine(currentLine + 1);
    }
  };

  // Render
  return (
    <div style={styles.container}>
      {!started ? (
        <>
          <h2 style={styles.title}>Ready to Start Your Interview?</h2>
          <button
            onClick={() => setStarted(true)}
            style={styles.startButton}
          >
            Start Interview
          </button>
          <Link href="/" style={styles.backLink}>
            Back to Welcome
          </Link>
        </>
      ) : (
        <div style={styles.contentContainer}>
          {/* Show all previous lines and responses */}
          {allLines.slice(0, currentLine).map((line, idx) => (
            <div key={idx} style={styles.questionContainer}>
              <div
                style={{
                  ...styles.questionText,
                  width: `${line.length + 1}ch`,
                }}
              >
                {line}
              </div>
              {userResponses[idx] && (
                <div style={styles.responseText}>
                  <span role="img" aria-label="microphone">🎤</span> {userResponses[idx]}
                </div>
              )}
            </div>
          ))}

          {/* Current line with typing effect */}
          {currentLine < allLines.length && (
            <div style={styles.currentQuestionContainer}>
              <div
                style={{
                  ...styles.currentQuestionText,
                  width: `${(allLines[currentLine] || "").length + 1}ch`,
                  borderRight: isTyping ? "2px solid #eee" : "none",
                  animation: isTyping ? "typing 1.2s steps(40), blink 1s step-end infinite" : undefined,
                }}
              >
                {typedText}
              </div>
              
              {/* Show current response if exists */}
              {userResponses[currentLine] && (
                <div style={styles.responseText}>
                  <span role="img" aria-label="microphone">🎤</span> {userResponses[currentLine]}
                </div>
              )}

              {/* Control buttons - only show if not typing and not at the last line */}
              {!isTyping && currentLine < allLines.length - 1 && (
                <div style={styles.buttonContainer}>
                  {!isListening && !userResponses[currentLine] && (
                    <button
                      onClick={handleMicClick}
                      style={styles.startRecordingButton}
                    >
                      <span role="img" aria-label="microphone">🎤</span>
                      Start Recording
                    </button>
                  )}
                  
                  {isListening && (
                    <button
                      onClick={handleDone}
                      style={styles.doneButton}
                    >
                      Done
                    </button>
                  )}
                  
                  {userResponses[currentLine] ? (
                    <>
                      <button
                        onClick={handleRedo}
                        style={styles.redoButton}
                      >
                        Redo
                      </button>
                      <button
                        onClick={handleNext}
                        style={styles.nextButton}
                      >
                        Next
                      </button>
                    </>
                  ) : (
                    <div style={{ color: "#f66", marginTop: "0.5rem", fontWeight: 600 }}>
                      No answer detected, please redo.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* If finished, show a message */}
          {currentLine >= allLines.length - 1 && (
            <div style={styles.completeMessage}>
              Interview complete! Thank you for your responses.
            </div>
          )}

          <Link href="/" style={styles.backLinkContainer}>
            Back to Welcome
          </Link>
        </div>
      )}

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

const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#000",
      color: "#eee",
      fontFamily: "'Courier New', monospace",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center",
      alignItems: "center",
      padding: "0 1rem",
      maxWidth: "600px",
      margin: "0 auto",
    },
    title: {
      fontSize: "2rem",
      marginBottom: "2rem",
    },
    startButton: {
      backgroundColor: "#222",
      color: "#eee",
      padding: "0.75rem 2rem",
      borderRadius: "6px",
      fontWeight: "600",
      fontSize: "1.1rem",
      border: "1px solid #444",
      cursor: "pointer",
      marginBottom: "2rem",
    },
    backLink: {
      color: "#0070f3",
      textDecoration: "underline",
    },
    contentContainer: {
      width: "100%",
      maxWidth: 500,
    },
    questionContainer: {
      marginBottom: "1.5rem",
    },
    questionText: {
      fontSize: "1.1rem",
      borderRight: "2px solid #eee",
      whiteSpace: "nowrap",
      overflow: "hidden",
      width: "fit-content",
      animation: "typing 1.2s steps(40), blink 1s step-end infinite",
    },
    responseText: {
      marginTop: "0.5rem",
      color: "#8ef",
      fontStyle: "italic",
    },
    currentQuestionContainer: {
      marginBottom: "2rem",
    },
    currentQuestionText: {
      fontSize: "1.2rem",
      borderRight: "2px solid #eee",
      whiteSpace: "nowrap",
      overflow: "hidden",
      width: "fit-content",
      animation: "typing 1.2s steps(40), blink 1s step-end infinite",
      minHeight: "2.2em",
    },
    buttonContainer: {
      marginTop: "1rem",
      display: "flex",
      gap: "0.5rem",
      flexWrap: "wrap" as const,
    },
    startRecordingButton: {
      padding: "10px 20px",
      fontSize: "1rem",
      fontFamily: "'Courier New', monospace",
      backgroundColor: "#222",
      color: "#eee",
      border: "1px solid #444",
      borderRadius: "4px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    doneButton: {
      padding: "10px 20px",
      fontSize: "1rem",
      fontFamily: "'Courier New', monospace",
      backgroundColor: "#444",
      color: "#eee",
      border: "1px solid #666",
      borderRadius: "4px",
      cursor: "pointer",
    },
    redoButton: {
      padding: "10px 20px",
      fontSize: "1rem",
      fontFamily: "'Courier New', monospace",
      backgroundColor: "#333",
      color: "#eee",
      border: "1px solid #555",
      borderRadius: "4px",
      cursor: "pointer",
    },
    nextButton: {
      padding: "10px 20px",
      fontSize: "1rem",
      fontFamily: "'Courier New', monospace",
      backgroundColor: "#222",
      color: "#eee",
      border: "1px solid #444",
      borderRadius: "4px",
      cursor: "pointer",
    },
    completeMessage: {
      marginTop: "2rem",
      color: "#8ef",
      fontWeight: 600,
    },
    backLinkContainer: {
      color: "#0070f3",
      textDecoration: "underline",
      marginTop: "2rem",
      display: "inline-block",
    },
  };
