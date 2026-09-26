// Start microphone
// Convert speech to text
// Detect speech pause / silence
// automatically call a callback function execute
// SpeechRecognition

import { useEffect, useRef, useState } from "react";

const SILENCE_TIMEOUT_MS = 5000;

export const useSpeechToText = (onSilence) => {
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const onSilenceRef = useRef(onSilence);
  const transcriptRef = useRef("");
  const finalTranscriptRef = useRef("");
  const isListeningRef = useRef(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    onSilenceRef.current = onSilence;
  }, [onSilence]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const resetTranscript = () => {
    transcriptRef.current = "";
    finalTranscriptRef.current = "";
    setTranscript("");
  };

  const resetSilenceTimer = () => {
    if (!onSilenceRef.current) {
      return;
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    silenceTimerRef.current = setTimeout(() => {
      onSilenceRef.current(transcriptRef.current);
    }, SILENCE_TIMEOUT_MS);
  };

  const startListening = ({ reset = true } = {}) => {
    if (reset) {
      resetTranscript();
    }
    isListeningRef.current = true;

    const speechWindow = /** @type {any} */ (window);
    const SpeechRecognition =
      speechWindow.SpeechRecognition ||
      speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition is not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = true;

    const restartRecognition = () => {
      if (!isListeningRef.current) {
        return;
      }

      try {
        recognition.start();
      } catch {
        // Ignore start errors if the recognition is already active.
      }
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      if (finalText) {
        finalTranscriptRef.current = `${finalTranscriptRef.current} ${finalText}`.trim();
      }

      const liveTranscript = `${finalTranscriptRef.current} ${interimText}`.trim();

      if (liveTranscript) {
        transcriptRef.current = liveTranscript;
        setTranscript(liveTranscript);
      }

      if (finalText || interimText) {
        resetSilenceTimer();
      }
    };

    recognition.onerror = (error) => {
      console.error("SpeechRecognition error", error);

      if (error && error.error === "not-allowed") {
        isListeningRef.current = false;
        return;
      }

      if (isListeningRef.current) {
        setTimeout(() => {
          restartRecognition();
        }, 200);
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        setTimeout(() => {
          restartRecognition();
        }, 150);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      // if already started, ignore and let onend recover
    }
  };

  const stopListening = () => {
    isListeningRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  return {
    stopListening,
    resetSilenceTimer,
    startListening,
    transcript,
    resetTranscript,
  };
};
