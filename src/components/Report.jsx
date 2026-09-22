const Report = ({ report }) => {
  const score = report?.score ?? "N/A";
  const correctAnswer = report?.correct_answer ?? "N/A";
  const feedback = report?.improvment_area ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 text-3xl">
            📊
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Interview Report
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Here is your AI-powered interview performance summary
          </p>
        </div>

        {/* Score Cards */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Overall Score */}
          <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium uppercase tracking-wider text-slate-400">
                  Overall Score
                </h3>

                <span className="rounded-lg bg-indigo-500/10 px-3 py-1 text-lg">
                  🎯
                </span>
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-5xl font-bold text-indigo-400">
                  {score}
                </span>

                {score !== "N/A" && (
                  <span className="mb-2 text-sm text-slate-500">
                    / 100
                  </span>
                )}
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{
                    width:
                      typeof score === "number"
                        ? `${Math.min(score, 100)}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Correct Answers */}
          <div className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-500/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium uppercase tracking-wider text-slate-400">
                  Correct Answers
                </h3>

                <span className="rounded-lg bg-green-500/10 px-3 py-1 text-lg">
                  ✅
                </span>
              </div>

              <div className="mt-5">
                <span className="text-5xl font-bold text-green-400">
                  {correctAnswer}
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Questions answered correctly
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:p-8">

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-xl">
              💡
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Detailed Feedback
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Areas where you can improve
              </p>
            </div>
          </div>

          {Array.isArray(feedback) && feedback.length > 0 ? (
            <ul className="space-y-3">
              {feedback.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-indigo-500/30 hover:bg-slate-900"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-semibold text-indigo-400">
                    {index + 1}
                  </span>

                  <p className="text-sm leading-6 text-slate-300">
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
              <p className="text-sm text-slate-500">
                No feedback available.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-600">
            🚀 Keep practicing and improve with every interview.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Report;