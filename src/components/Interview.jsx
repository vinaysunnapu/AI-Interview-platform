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
  onRepeatQuestion,
  transcript,
}) => {
  const isAsking =
    state === APP_CONSTANT.INTRO ||
    state === APP_CONSTANT.ASKING ||
    state === APP_CONSTANT.REPLAYING;
  const isListening = state === APP_CONSTANT.LISTENING;
  const canSend = transcript && transcript.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#10211d] px-4 py-6 text-[#f1f5ee] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col">
        <header className="mb-8 flex flex-col gap-5 border-b border-white/15 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c6ed79] text-sm font-bold text-[#10211d]">AI</span>
            <div>
              <h1 className="text-sm font-semibold">Interview Studio</h1>
              <p className="mt-0.5 text-xs text-[#91a59a]">Live practice session</p>
            </div>
          </div>
          <div className="flex justify-start sm:justify-end">
            <div
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                isAsking
                  ? "border-[#c6ed79]/30 bg-[#c6ed79]/10 text-[#d4f39c]"
                  : isListening
                  ? "border-[#72c49a]/30 bg-[#72c49a]/10 text-[#9ce0b9]"
                  : "border-white/15 bg-white/5 text-[#b8c7be]"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isAsking
                    ? "animate-pulse bg-[#c6ed79]"
                    : isListening
                    ? "animate-pulse bg-[#72c49a]"
                    : "bg-[#91a59a]"
                }`}
              />

              {isAsking
                ? state === APP_CONSTANT.REPLAYING
                  ? "AI is repeating the question"
                  : "AI is asking a question"
                : isListening
                ? "Ready for your answer"
                : "Waiting..."}
            </div>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
          <div
            className={`relative h-full min-h-[28rem] overflow-hidden rounded-lg border p-5 shadow-[0_18px_55px_rgba(0,0,0,0.16)] transition-all duration-300 sm:p-7 ${
              isAsking
                ? "border-[#c6ed79]/50 bg-[#19382c]"
                : "border-white/15 bg-[#153027]"
            }`}
          >
            {isAsking && (
              <div className="absolute right-0 top-0 h-40 w-40 bg-[#c6ed79]/10 blur-3xl" />
            )}

            <div className="relative flex h-full flex-col items-center">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c6ed79]/15 text-lg">
                  ✦
                </div>

                <h2 className="text-lg font-semibold">AI interviewer</h2>
              </div>

              <p className="mb-5 text-sm text-[#b8c7be]">
                {isAsking
                  ? state === APP_CONSTANT.REPLAYING
                    ? "The interviewer is repeating the question"
                    : "The interviewer is speaking"
                  : "Waiting for the next question"}
              </p>

              <div
                className={`flex h-64 w-full max-w-sm items-center justify-center overflow-hidden rounded-lg border ${
                  isAsking
                    ? "border-[#c6ed79]/25 bg-[#10211d]"
                    : "border-white/10 bg-[#10211d]"
                }`}
              >
                {isAsking ? (
                  <img
                    src={speaking}
                    alt="AI interviewer speaking"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-[#91a59a]">
                    <span className="text-6xl text-[#c6ed79]/70">✦</span>
                    <span className="mt-3 text-sm">AI is waiting</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className={`relative h-full min-h-[28rem] overflow-hidden rounded-lg border p-5 shadow-[0_18px_55px_rgba(0,0,0,0.16)] transition-all duration-300 sm:p-7 ${
              isListening
                ? "border-[#72c49a]/50 bg-[#19382c]"
                : "border-white/15 bg-[#153027]"
            }`}
          >
            {isListening && (
              <div className="absolute left-0 top-0 h-40 w-40 bg-[#72c49a]/10 blur-3xl" />
            )}

            <div className="relative flex h-full flex-col items-center">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#72c49a]/15 text-lg text-[#9ce0b9]">
                  ◉
                </div>

                <h2 className="text-lg font-semibold">Your response</h2>
              </div>

              <p className="mb-5 text-center text-sm text-[#b8c7be]">
                {isAsking
                  ? "Microphone is muted while the interviewer is speaking"
                  : isMicMuted
                  ? "Microphone is muted. Click to unmute when ready."
                  : "Microphone is active. Speak your answer."}
              </p>

              <div
                className={`flex h-64 w-full max-w-sm items-center justify-center overflow-hidden rounded-lg border ${
                  !isMicMuted && isListening
                    ? "border-[#72c49a]/30 bg-[#10211d]"
                    : "border-white/10 bg-[#10211d]"
                }`}
              >
                {!isMicMuted && isListening ? (
                  <img
                    src={listening}
                    alt="You are speaking"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-[#91a59a]">
                    <span className="text-6xl text-[#9ce0b9]">◉</span>
                    <span className="mt-3 text-sm">Microphone is waiting</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-lg border border-white/15 bg-[#153027] p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onRepeatQuestion}
              disabled={isAsking}
              className="flex min-h-11 items-center gap-2 rounded-lg border border-[#c6ed79]/30 bg-[#c6ed79]/10 px-4 py-2.5 text-sm font-medium text-[#d4f39c] transition hover:border-[#c6ed79]/60 hover:bg-[#c6ed79]/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span aria-hidden="true">🔁</span>
              Repeat question
            </button>

            <button
              type="button"
              onClick={skipQuestion}
              disabled={isAsking}
              className="flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-[#dce7df] transition hover:border-[#c6ed79]/40 hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span aria-hidden="true">⏭️</span>
              Skip question
            </button>

            <button
              type="button"
              onClick={endInterview}
              className="flex min-h-11 items-center gap-2 rounded-lg border border-[#d58b76]/35 bg-[#d58b76]/10 px-4 py-2.5 text-sm font-medium text-[#efb3a1] transition hover:border-[#d58b76]/60 hover:bg-[#d58b76]/20 active:scale-95"
            >
              <span aria-hidden="true">⏹️</span>
              End interview
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            {!isMicMuted && (
              <div className="flex items-center gap-2 rounded-full border border-[#d58b76]/40 bg-[#d58b76]/10 px-3 py-2 text-xs font-medium uppercase tracking-wider text-[#efb3a1]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#e89075]" />
                Recording
              </div>
            )}

            <button
              type="button"
              onClick={onToggleMic}
              disabled={isAsking}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                isMicMuted
                  ? "border-white/15 bg-white/5 text-[#f1f5ee] hover:border-[#c6ed79]/50 hover:bg-white/10"
                  : "border-[#72c49a]/40 bg-[#72c49a]/10 text-[#9ce0b9] hover:border-[#72c49a]/60"
              }`}
            >
              <span aria-hidden="true">{isMicMuted ? "🔇" : "🎙️"}</span>
              {isMicMuted ? "Unmute mic" : "Mute mic"}
            </button>

            <button
              type="button"
              onClick={onSubmitAnswer}
              disabled={!canSend || isAsking}
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#c6ed79] px-5 py-2.5 text-sm font-semibold text-[#17392b] transition hover:bg-[#d4f39c] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send answer
            </button>
          </div>
        </div>

        <CandidateAnswerPanel
          transcript={transcript}
          isMicMuted={isMicMuted}
          isAsking={isAsking}
        />

        <div className="mt-8 text-center">
          <p className="text-xs text-[#91a59a]">
            💡 Take your time, unmute when ready, and send the answer when you are done.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Interview;