import { useEffect, useRef, useState } from "react";
import { APP_CONSTANT } from "../util/constant";
import StartInterview from "../components/StartInterview";
import { submitApi, reportApi, endInterviewApi } from "../services/interview";
import { playAudio, stopAudio } from "../util/audio";
import Interview from "../components/Interview";
import { useSpeechToText } from "../hooks/useSpeechToText";
import Report from "../components/Report";

const ACTIVE_STATUSES = [
  APP_CONSTANT.INTRO,
  APP_CONSTANT.ASKING,
  APP_CONSTANT.REPLAYING,
  APP_CONSTANT.LISTENING,
  APP_CONSTANT.SUBMITTING,
];

const InterviewPage = () => {
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState(APP_CONSTANT.IDLE);
  const [question, setQuestion] = useState("");
  const [introText, setIntroText] = useState("");
  const [questionAcknowledgement, setQuestionAcknowledgement] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [report, setReport] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canRetryEnd, setCanRetryEnd] = useState(false);
  const [canRetryReport, setCanRetryReport] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const resumeMicAfterReplay = useRef(false);
  const mountedRef = useRef(false);
  const audioRunRef = useRef(0);
  const deadlineRef = useRef(null);
  const submitLockRef = useRef(false);
  const endLockRef = useRef(false);
  const timeoutEndStartedRef = useRef(false);
  const timeoutPendingRef = useRef(false);
  const sessionCompleteRef = useRef(false);
  const failedTurnRef = useRef(null);
  const endInterviewRef = useRef(null);

  const { startListening, stopListening, transcript, resetTranscript } =
    useSpeechToText();
  const speechControls = useRef({ startListening, stopListening, resetTranscript });

  useEffect(() => {
    speechControls.current = { startListening, stopListening, resetTranscript };
  }, [startListening, stopListening, resetTranscript]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      audioRunRef.current += 1;
      stopAudio();
      speechControls.current.stopListening();
    };
  }, []);

  useEffect(() => {
    if (![APP_CONSTANT.INTRO, APP_CONSTANT.ASKING, APP_CONSTANT.REPLAYING].includes(status)) {
      return undefined;
    }

    const audioRun = ++audioRunRef.current;
    speechControls.current.stopListening();
    if (status === APP_CONSTANT.ASKING) {
      speechControls.current.resetTranscript();
    }

    const speech = status === APP_CONSTANT.INTRO
      ? introText
      : status === APP_CONSTANT.REPLAYING
      ? question
      : `${questionAcknowledgement} ${question}`.trim();

    playAudio(speech, () => {
      if (!mountedRef.current || audioRun !== audioRunRef.current) {
        return;
      }

      if (status === APP_CONSTANT.INTRO) {
        setStatus(APP_CONSTANT.ASKING);
        return;
      }

      setStatus(APP_CONSTANT.LISTENING);
      if (status === APP_CONSTANT.REPLAYING && resumeMicAfterReplay.current) {
        setIsMicMuted(false);
        speechControls.current.startListening({ reset: false });
      }
    });

    return () => {
      audioRunRef.current += 1;
      stopAudio();
    };
  }, [status, question, questionAcknowledgement, introText]);

  const timerActive = Boolean(sessionId) && ACTIVE_STATUSES.includes(status);

  useEffect(() => {
    if (!timerActive || deadlineRef.current === null) {
      return undefined;
    }

    const updateCountdown = () => {
      const nextRemaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setRemainingSeconds(nextRemaining);

      if (nextRemaining === 0 && !timeoutEndStartedRef.current) {
        timeoutEndStartedRef.current = true;
        endInterviewRef.current?.(true);
      }
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 250);
    return () => window.clearInterval(timer);
  }, [timerActive]);

  const syncRemainingTime = (seconds) => {
    if (!Number.isFinite(seconds)) {
      return;
    }

    const remaining = Math.max(0, Math.ceil(seconds));
    deadlineRef.current = Date.now() + remaining * 1000;
    setRemainingSeconds(remaining);
  };

  const getErrorMessage = (requestError, fallback) =>
    requestError?.response?.data?.detail || requestError?.message || fallback;

  const handleRepeatQuestion = () => {
    if (status !== APP_CONSTANT.LISTENING) {
      return;
    }

    resumeMicAfterReplay.current = !isMicMuted;
    setIsMicMuted(true);
    setStatus(APP_CONSTANT.REPLAYING);
  };

  const handleToggleMic = () => {
    if (status !== APP_CONSTANT.LISTENING || remainingSeconds === 0) {
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

  const showReport = async (reportData) => {
    let result = reportData;
    if (!result) {
      const response = await reportApi(sessionId);
      result = response?.result;
    }

    if (!result) {
      throw new Error("The interview ended, but its report is not available yet.");
    }

    sessionCompleteRef.current = true;
    stopAudio();
    stopListening();
    if (mountedRef.current) {
      setReport(result);
      setStatus(APP_CONSTANT.COMPLETED);
      setError("");
    }
  };

  const submitTurn = async (answer, skip = false) => {
    if (submitLockRef.current || !sessionId || status === APP_CONSTANT.ENDING) {
      return;
    }

    submitLockRef.current = true;
    failedTurnRef.current = { answer, skip };
    setIsSubmitting(true);
    setError("");
    setIsMicMuted(true);
    stopAudio();
    stopListening();
    setStatus(APP_CONSTANT.SUBMITTING);

    let turnSucceeded = false;
    const payload = { session_id: sessionId, answer, skip };

    try {
      const data = await submitApi(payload);
      turnSucceeded = true;
      failedTurnRef.current = null;
      resetTranscript();
      if (Number.isFinite(data?.remainingSeconds)) {
        syncRemainingTime(data.remainingSeconds);
      }

      if (data?.InterviewEnded) {
        sessionCompleteRef.current = true;
        try {
          await showReport(data.report);
        } catch (reportError) {
          if (mountedRef.current) {
            setStatus(APP_CONSTANT.ENDING);
            setCanRetryReport(true);
            setError(getErrorMessage(reportError, "We couldn't load your interview report."));
          }
        }
        return;
      }

      if (!data?.nextQuestion) {
        throw new Error("The server did not provide the next question. Please retry.");
      }

      setQuestion(data.nextQuestion);
      setQuestionAcknowledgement(data.interviewerResponse || "");
      setQuestionType(data.questionType || "");
      setStatus(APP_CONSTANT.ASKING);
      setError("");
    } catch (requestError) {
      if (!turnSucceeded && mountedRef.current) {
        setError(getErrorMessage(requestError, "We couldn't submit your answer. Please retry."));
        setStatus(APP_CONSTANT.LISTENING);
      }
    } finally {
      submitLockRef.current = false;
      if (mountedRef.current) {
        setIsSubmitting(false);
      }
      if (timeoutPendingRef.current && !sessionCompleteRef.current) {
        timeoutPendingRef.current = false;
        endInterviewRef.current?.(true);
      }
    }
  };

  const startInterview = (data, session_id) => {
    setSessionId(session_id);
    setQuestion(data.firstQuestion);
    setIntroText(data.introText || "");
    setQuestionAcknowledgement("");
    setQuestionType("");
    setIsMicMuted(true);
    setReport(null);
    setError("");
    setCanRetryEnd(false);
    setCanRetryReport(false);
    sessionCompleteRef.current = false;
    timeoutEndStartedRef.current = false;
    timeoutPendingRef.current = false;
    endLockRef.current = false;
    submitLockRef.current = false;
    resetTranscript();
    syncRemainingTime(data.remainingSeconds ?? data.durationSeconds ?? 600);
    setStatus(APP_CONSTANT.INTRO);
  };

  const handleSubmitAnswer = () => {
    const finalAnswer = (transcript || "").trim();
    if (finalAnswer) {
      submitTurn(finalAnswer, false);
    }
  };

  const skipQuestion = () => submitTurn(null, true);

  const endInterview = async () => {
    if (sessionCompleteRef.current || endLockRef.current || !sessionId) {
      return;
    }
    if (submitLockRef.current) {
      timeoutPendingRef.current = true;
      return;
    }

    endLockRef.current = true;
    stopAudio();
    stopListening();
    setIsMicMuted(true);
    setError("");
    setCanRetryEnd(false);
    setCanRetryReport(false);
    setStatus(APP_CONSTANT.ENDING);

    try {
      let response;
      try {
        response = await endInterviewApi(sessionId);
      } catch (requestError) {
        const detail = requestError?.response?.data?.detail || requestError?.message || "";
        if (requestError?.response?.status !== 409 && !/already ended/i.test(detail)) {
          throw requestError;
        }
        response = { InterviewEnded: true };
      }

      if (response?.report) {
        await showReport(response.report);
      } else if (response?.InterviewEnded || response?.alreadyEnded) {
        await showReport(null);
      } else {
        throw new Error("The server did not confirm that the interview ended.");
      }
    } catch (requestError) {
      if (mountedRef.current) {
        setError(getErrorMessage(requestError, "We couldn't end the interview. Please retry."));
        setCanRetryEnd(true);
        setStatus(APP_CONSTANT.LISTENING);
      }
    } finally {
      endLockRef.current = false;
    }
  };

  useEffect(() => {
    endInterviewRef.current = endInterview;
  });

  const retryFailedTurn = () => {
    if (failedTurnRef.current) {
      submitTurn(failedTurnRef.current.answer, failedTurnRef.current.skip);
    }
  };

  const retryReport = async () => {
    setError("");
    try {
      await showReport(null);
    } catch (reportError) {
      if (mountedRef.current) {
        setError(getErrorMessage(reportError, "We couldn't load your interview report."));
      }
    }
  };

  return (
    <>
      {status === APP_CONSTANT.IDLE && <StartInterview onClick={startInterview} />}
      {status !== APP_CONSTANT.IDLE && status !== APP_CONSTANT.COMPLETED && (
        <Interview
          skipQuestion={skipQuestion}
          endInterview={endInterview}
          state={status}
          isMicMuted={isMicMuted}
          onToggleMic={handleToggleMic}
          onSubmitAnswer={handleSubmitAnswer}
          onRepeatQuestion={handleRepeatQuestion}
          onRetryTurn={retryFailedTurn}
          onRetryEnd={endInterview}
          onRetryReport={retryReport}
          transcript={transcript}
          question={question}
          interviewerResponse={questionAcknowledgement}
          questionType={questionType}
          remainingSeconds={remainingSeconds}
          error={error}
          isSubmitting={isSubmitting}
          canRetryEnd={canRetryEnd}
          canRetryReport={canRetryReport}
        />
      )}
      {status === APP_CONSTANT.COMPLETED && <Report report={report} />}
    </>
  );
};

export default InterviewPage;