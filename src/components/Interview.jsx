import speaking from "../assets/images/speaking.gif";
import listening from "../assets/images/listening.gif";
import CandidateAnswerPanel from "./CandidateAnswerPanel";
import { APP_CONSTANT } from "../util/constant";

const Interview = ({
  skipQuestion,
  endInterview,
  state,
  isMicMuted,
  onToggleMic,
  onSubmitAnswer,
  transcript,
}) => {
  const isAsking =
    state === APP_CONSTANT.INTRO || state === APP_CONSTANT.ASKING;
  const isListening = state === APP_CONSTANT.LISTENING;
  const canSend = transcript && transcript.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            AI Interview
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Your AI-powered interview is in progress
          </p>

          <div className="mt-4 flex justify-center">
            <div
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                isAsking
                  ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                  : isListening
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-slate-700 bg-slate-800/50 text-slate-400"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isAsking
                    ? "animate-pulse bg-indigo-400"
                    : isListening
                    ? "animate-pulse bg-green-400"
                    : "bg-slate-500"
                }`}
              />

              {isAsking
                ? "AI is asking a question"
                : isListening
                ? "Ready for your answer"
                : "Waiting..."}
            </div>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <div
            className={`relative overflow-hidden rounded-3xl border p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
              isAsking
                ? "border-indigo-500/50 bg-indigo-500/10 shadow-indigo-500/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            {isAsking && (
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
            )}

            <div className="relative flex flex-col items-center">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/20">
                  🤖
                </div>

                <h2 className="text-xl font-semibold">AI Interviewer</h2>
              </div>

              <p className="mb-6 text-sm text-slate-400">
                {isAsking
                  ? "The interviewer is speaking"
                  : "Waiting for the next question"}
              </p>

              <div
                className={`flex h-64 w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl border ${
                  isAsking
                    ? "border-indigo-500/30 bg-indigo-950/40"
                    : "border-slate-800 bg-slate-900/70"
                }`}
              >
                {isAsking ? (
                  <img
                    src={speaking}
                    alt="AI interviewer speaking"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-600">
                    <span className="text-6xl">🤖</span>
                    <span className="mt-3 text-sm">AI is waiting</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-center gap-3 lg:flex-col">
            <button
              onClick={skipQuestion}
              disabled={isAsking}
              className="group flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-medium text-slate-200 shadow-lg transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-700 disabled:hover:bg-slate-800/80 disabled:hover:text-slate-200"
            >
              <span className="transition-transform group-hover:translate-x-1">⏭️</span>
              Skip
            </button>

            <button
              onClick={endInterview}
              className="group flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-400 shadow-lg transition-all hover:border-red-500/60 hover:bg-red-500/20 active:scale-95"
            >
              <span>⏹️</span>
              End
            </button>
          </div>

          <div
            className={`relative overflow-hidden rounded-3xl border p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
              isListening
                ? "border-green-500/50 bg-green-500/10 shadow-green-500/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            {isListening && (
              <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-green-500/20 blur-3xl" />
            )}

            <div className="relative flex flex-col items-center">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/20">
                  👤
                </div>

                <h2 className="text-xl font-semibold">You</h2>
              </div>

              <p className="mb-6 text-center text-sm text-slate-400">
                {isAsking
                  ? "Microphone is muted while the interviewer is speaking"
                  : isMicMuted
                  ? "Microphone is muted. Click to unmute when ready."
                  : "Microphone is active. Speak your answer."}
              </p>

              <div
                className={`mb-4 flex h-64 w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl border ${
                  !isMicMuted && isListening
                    ? "border-green-500/30 bg-green-950/40"
                    : "border-slate-800 bg-slate-900/70"
                }`}
              >
                {!isMicMuted && isListening ? (
                  <img
                    src={listening}
                    alt="You are speaking"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-600">
                    <span className="text-6xl">🎙️</span>
                    <span className="mt-3 text-sm">Microphone is waiting</span>
                  </div>
                )}
              </div>

              <div className="flex w-full flex-col gap-3">
                <div className="flex w-full flex-col gap-2">
                  {!isMicMuted && (
                    <div className="flex items-center justify-center gap-2 self-center rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-red-300">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                      Recording
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={onToggleMic}
                    disabled={isAsking}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                      isMicMuted
                        ? "border-slate-700 bg-slate-800/80 text-slate-100 hover:border-indigo-500 hover:bg-indigo-500/10"
                        : "border-green-500/40 bg-green-500/15 text-green-300 hover:border-green-500/60"
                    }`}
                  >
                    <span>{isMicMuted ? "🔇" : "🎙️"}</span>
                    {isMicMuted ? "Unmute Mic" : "Mute Mic"}
                  </button>
                </div>

                {canSend && (
                  <button
                    type="button"
                    onClick={onSubmitAnswer}
                    className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.98]"
                  >
                    Send Answer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <CandidateAnswerPanel
          transcript={transcript}
          isMicMuted={isMicMuted}
          isAsking={isAsking}
        />

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-600">
            💡 Take your time, unmute when ready, and send the answer when you are done.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Interview;