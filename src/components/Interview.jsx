import speaking from "../assets/images/speaking.gif";
import listening from "../assets/images/listening.gif";
import { APP_CONSTANT } from "../util/constant";

const Interview = ({ skipQuestion, endInterview, state }) => {
  const isAsking =
    state === APP_CONSTANT.INTRO || state === APP_CONSTANT.ASKING;
  const isListening = state === APP_CONSTANT.LISTENING;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            AI Interview
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Your AI-powered interview is in progress
          </p>

          {/* Current Status */}
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
                ? "Listening to you..."
                : "Waiting..."}
            </div>
          </div>
        </div>

        {/* Interview Area */}
        <div className="grid flex-1 grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">

          {/* AI Interviewer */}
          <div
            className={`relative overflow-hidden rounded-3xl border p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
              isAsking
                ? "border-indigo-500/50 bg-indigo-500/10 shadow-indigo-500/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            {/* Glow */}
            {isAsking && (
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
            )}

            <div className="relative flex flex-col items-center">

              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/20">
                  🤖
                </div>

                <h2 className="text-xl font-semibold">
                  AI Interviewer
                </h2>
              </div>

              <p className="mb-6 text-sm text-slate-400">
                {isAsking
                  ? "The interviewer is speaking"
                  : "Waiting for the next question"}
              </p>

              {/* AI Animation */}
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
                    <span className="mt-3 text-sm">
                      AI is waiting
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-row items-center justify-center gap-3 lg:flex-col">

            <button
              onClick={skipQuestion}
              className="group flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-medium text-slate-200 shadow-lg transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400 active:scale-95"
            >
              <span className="transition-transform group-hover:translate-x-1">
                ⏭️
              </span>
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

          {/* Candidate */}
          <div
            className={`relative overflow-hidden rounded-3xl border p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
              isListening
                ? "border-green-500/50 bg-green-500/10 shadow-green-500/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            {/* Glow */}
            {isListening && (
              <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-green-500/20 blur-3xl" />
            )}

            <div className="relative flex flex-col items-center">

              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/20">
                  👤
                </div>

                <h2 className="text-xl font-semibold">
                  You
                </h2>
              </div>

              <p className="mb-6 text-sm text-slate-400">
                {isListening
                  ? "Speak clearly, the AI is listening"
                  : "Your microphone is waiting"}
              </p>

              {/* Candidate Animation */}
              <div
                className={`flex h-64 w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl border ${
                  isListening
                    ? "border-green-500/30 bg-green-950/40"
                    : "border-slate-800 bg-slate-900/70"
                }`}
              >
                {isListening ? (
                  <img
                    src={listening}
                    alt="You are speaking"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-600">
                    <span className="text-6xl">🎙️</span>
                    <span className="mt-3 text-sm">
                      Microphone is waiting
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-600">
            💡 Take your time and answer naturally. Good luck!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Interview;