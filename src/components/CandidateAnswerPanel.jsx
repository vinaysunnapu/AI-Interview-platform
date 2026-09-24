const CandidateAnswerPanel = ({ transcript, isMicMuted, isAsking }) => {
  const hasTranscript = transcript && transcript.trim().length > 0;

  return (
    <div className="mt-6 w-full rounded-2xl border border-slate-700 bg-slate-900/60 p-5 shadow-xl backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">Candidate Answer</h3>
        <span className="rounded-full border border-slate-600 bg-slate-800/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-300">
          {isAsking ? "Muted" : isMicMuted ? "Muted" : "Live"}
        </span>
      </div>

      <div className="min-h-[120px] rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        {hasTranscript ? (
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-100">
            {transcript}
          </p>
        ) : (
          <p className="text-sm leading-7 text-slate-500">
            {isAsking
              ? "The interviewer is speaking. The candidate answer will appear here when the mic is unmuted."
              : isMicMuted
              ? "Mic is muted. Unmute when you are ready to speak."
              : "Listening for the candidate response..."}
          </p>
        )}
      </div>
    </div>
  );
};

export default CandidateAnswerPanel;
