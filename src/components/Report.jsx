const Report = ({ report }) => {
  const score = report?.score ?? "N/A";
  const correctAnswer = report?.correct_answer ?? "N/A";
  const totalAnswers = report?.total_answers ?? "N/A";
  const feedback = Array.isArray(report?.improvment_area)
    ? report.improvment_area
    : report?.improvment_area
    ? [report.improvment_area]
    : [];
  const strengths = Array.isArray(report?.strengths)
    ? report.strengths
    : report?.strengths
    ? [report.strengths]
    : [];
  const numericScore = Number(score);
  const scoreProgress = Number.isFinite(numericScore)
    ? `${Math.min(Math.max(numericScore, 0), 100)}%`
    : "0%";

  return (
    <div className="min-h-screen bg-[#10211d] px-5 py-6 text-[#f1f5ee] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between border-b border-white/15 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c6ed79] text-sm font-bold text-[#10211d]">
              AI
            </span>
            <div>
              <p className="text-sm font-semibold">Interview Studio</p>
              <p className="mt-0.5 text-xs text-[#91a59a]">Session debrief</p>
            </div>
          </div>
          <span className="rounded-full border border-[#72c49a]/30 bg-[#72c49a]/10 px-3 py-1.5 text-xs font-medium text-[#9ce0b9]">
            Interview complete
          </span>
        </header>

        <main className="py-8 sm:py-12">
          <div className="mb-8 grid gap-6 border-b border-white/15 pb-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-[#c6ed79]">
                <span className="h-2 w-2 rounded-full bg-[#c6ed79]" />
                Your results
              </p>
              <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
                Interview debrief
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#b8c7be] sm:text-base">
                A snapshot of how you did, with focused ideas for your next practice.
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#91a59a]">
                Keep the momentum
              </p>
              <p className="mt-1 text-sm text-[#d4f39c]">Every round is progress.</p>
            </div>
          </div>

          <section aria-label="Interview results" className="grid gap-4 md:grid-cols-3">
            <article className="rounded-lg bg-[#c6ed79] p-6 text-[#17392b] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#42604d]">Overall score</p>
                  <p className="mt-1 text-xs text-[#567b55]">Interview performance</p>
                </div>
                <span aria-hidden="true" className="text-2xl">✳</span>
              </div>
              <div className="mt-7 flex items-baseline gap-2">
                <span className="font-serif text-6xl leading-none sm:text-7xl">{score}</span>
                {score !== "N/A" && <span className="text-sm text-[#42604d]">/ 100</span>}
              </div>
              <div
                className="mt-6 h-2 overflow-hidden rounded-full bg-[#17392b]/15"
                role="progressbar"
                aria-label="Overall score"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Number.isFinite(numericScore) ? Math.min(Math.max(numericScore, 0), 100) : 0}
              >
                <div className="h-full rounded-full bg-[#17392b] transition-all" style={{ width: scoreProgress }} />
              </div>
            </article>

            <article className="flex flex-col justify-between rounded-lg border border-white/15 bg-[#153027] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#f1f5ee]">Correct answers</p>
                  <p className="mt-1 text-xs text-[#91a59a]">Questions answered correctly</p>
                </div>
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#72c49a]/10 text-lg text-[#9ce0b9]">✓</span>
              </div>
              <div className="mt-7 font-serif text-6xl leading-none text-[#9ce0b9] sm:text-7xl">
                {correctAnswer}
              </div>
            </article>

            <article className="flex flex-col justify-between rounded-lg border border-white/15 bg-[#153027] p-6 sm:p-8">
              <div>
                <p className="text-sm font-semibold text-[#f1f5ee]">Total answers</p>
                <p className="mt-1 text-xs text-[#91a59a]">Turns completed</p>
              </div>
              <div className="mt-7 font-serif text-6xl leading-none text-[#d4f39c] sm:text-7xl">
                {totalAnswers}
              </div>
            </article>
          </section>

          {(report?.summary || strengths.length > 0) && (
            <section className="mt-8 grid gap-6 border-y border-white/15 py-7 md:grid-cols-2">
              {report?.summary && (
                <div>
                  <h2 className="text-sm font-semibold text-[#f1f5ee]">Summary</h2>
                  <p className="mt-3 text-sm leading-7 text-[#b8c7be]">{report.summary}</p>
                </div>
              )}
              {strengths.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-[#f1f5ee]">Strengths</h2>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[#b8c7be]">
                    {strengths.map((strength, index) => (
                      <li key={`${index}-${strength}`}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          <section className="mt-8 rounded-lg bg-[#edf3ee] p-5 text-[#162821] sm:p-8" aria-labelledby="feedback-title">
            <div className="mb-6 flex flex-col gap-2 border-b border-[#d3ded5] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold text-[#567b55]">Next steps</p>
                <h2 id="feedback-title" className="font-serif text-3xl sm:text-4xl">
                  Areas to strengthen
                </h2>
              </div>
              <p className="text-sm text-[#718477]">Use these as prompts for your next round.</p>
            </div>

            {Array.isArray(feedback) && feedback.length > 0 ? (
              <ol className="divide-y divide-[#d3ded5]">
                {feedback.map((point, index) => (
                  <li key={`${index}-${point}`} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dce9de] text-xs font-semibold text-[#42604d]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="pt-1 text-sm leading-6 text-[#344b3c]">{point}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="py-3 text-sm text-[#718477]">No additional feedback is available for this session.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Report;