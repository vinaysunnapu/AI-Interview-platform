import { useEffect, useRef, useState } from "react";
import { APP_CONSTANT } from "../util/constant";
import StartInterview from "../components/StartInterview";
import { submitApi, reportApi, endInterviewApi } from "../services/interview";
import { playAudio, stopAudio } from "../util/audio";
import Interview from "../components/Interview";
import { useSpeechToText } from "../hooks/useSpeechToText";
import Report from "../components/Report";

const InterviewPage = () => {
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState(APP_CONSTANT.IDLE);
  const [question, setQuestion] = useState("");
  const [questionAcknowledgement, setQuestionAcknowledgement] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const resumeMicAfterReplay = useRef(false);

  const { startListening, stopListening, transcript, resetTranscript } =
    useSpeechToText();
  const speechControls = useRef({ startListening, stopListening, resetTranscript });
  speechControls.current = { startListening, stopListening, resetTranscript };

  useEffect(() => {
    if (status === APP_CONSTANT.ASKING || status === APP_CONSTANT.REPLAYING) {
      speechControls.current.stopListening();
      if (status === APP_CONSTANT.ASKING) {
        speechControls.current.resetTranscript();
      }

      const speech = status === APP_CONSTANT.REPLAYING
        ? question
        : `${questionAcknowledgement} ${question}`.trim();

      playAudio(speech, () => {
        setStatus(APP_CONSTANT.LISTENING);
        if (status === APP_CONSTANT.REPLAYING && resumeMicAfterReplay.current) {
          setIsMicMuted(false);
          speechControls.current.startListening({ reset: false });
        }
      });
    }
  }, [status, question, questionAcknowledgement]);

  const handleRepeatQuestion = () => {
    if (status !== APP_CONSTANT.LISTENING) {
      return;
    }

    resumeMicAfterReplay.current = !isMicMuted;
    setIsMicMuted(true);
    setStatus(APP_CONSTANT.REPLAYING);
  };

  const handleToggleMic = () => {
    if (status === APP_CONSTANT.INTRO || status === APP_CONSTANT.ASKING) {
      return;
    }

    if (isMicMuted) {
      setIsMicMuted(false);
      startListening();
      return;
    }

    stopListening();
    setIsMicMuted(true);
  };

  const handleSubmitAnswer = async () => {
    const finalAnswer = (transcript || "").trim();

    if (!finalAnswer) {
      return;
    }

    stopListening();
    setIsMicMuted(true);

    const payload = {
      session_id: sessionId,
      answer: finalAnswer,
      skip: false,
    };

    const data = await submitApi(payload);

    if (!data) {
      console.error("Answer submission failed");
      return;
    }

    resetTranscript();

    if (data.InterviewEnded) {
      await finishInterview();
      return;
    }

    setQuestion(data.nextQuestion);
    setQuestionAcknowledgement("Thank you for your answer. Let's move on to the next question.");
    setStatus(APP_CONSTANT.ASKING);
  };

  const startInterview = async (data, session_id) => {
    setLoading(false);
    setSessionId(session_id);
    setQuestion(data.firstQuestion);
    setQuestionAcknowledgement("");
    setIsMicMuted(true);
    resetTranscript();
    setStatus(APP_CONSTANT.INTRO);

    const introText = data.introText;
    playAudio(introText, () => {
      setStatus(APP_CONSTANT.ASKING);
    });
  };

  const skipQuestion = async () => {
    stopListening();
    setIsMicMuted(true);
    resetTranscript();

    const payload = {
      session_id: sessionId,
      answer: "",
      skip: true,
    };

    const data = await submitApi(payload);

    if (!data) {
      console.error("Skip question failed");
      return;
    }

    if (data.InterviewEnded) {
      await finishInterview();
      return;
    }

    setQuestion(data.nextQuestion);
    setQuestionAcknowledgement("");
    setStatus(APP_CONSTANT.ASKING);
  };

  const endInterview = async () => {
    stopAudio();
    stopListening();
    setIsMicMuted(true);
    resetTranscript();

    await endInterviewApi(sessionId);
    await finishInterview();
  };

  const finishInterview = async () => {
    setLoading(true);

    const data = await reportApi(sessionId);

    if (!data) {
      setLoading(false);
      return;
    }

    setReport(data.result);
    setStatus(APP_CONSTANT.COMPLETED);
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-sm font-medium text-indigo-400">
          <div className="flex items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400/30 border-t-indigo-400" />
            <span>Generating your report...</span>
          </div>
        </div>
      ) : (
        <>
          {status === APP_CONSTANT.IDLE && <StartInterview onClick={startInterview} />}
          {(status === APP_CONSTANT.INTRO ||
            status === APP_CONSTANT.ASKING ||
            status === APP_CONSTANT.REPLAYING ||
            status === APP_CONSTANT.LISTENING) && (
            <Interview
              skipQuestion={skipQuestion}
              endInterview={endInterview}
              state={status}
              isMicMuted={isMicMuted}
              onToggleMic={handleToggleMic}
              onSubmitAnswer={handleSubmitAnswer}
              onRepeatQuestion={handleRepeatQuestion}
              transcript={transcript}
            />
          )}
          {status === APP_CONSTANT.COMPLETED && <Report report={report} />}
        </>
      )}
    </>
  );
};

export default InterviewPage;
