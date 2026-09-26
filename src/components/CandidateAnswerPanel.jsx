const CandidateAnswerPanel = ({ transcript, isMicMuted, isAsking }) => {
  const hasTranscript = transcript && transcript.trim().length > 0;

  return (
    <div className="mt-5 w-full rounded-lg border border-white/15 bg-[#edf3ee] p-4 text-[#162821] shadow-[0_16px_45px_rgba(0,0,0,0.14)] sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#263b30]">Your answer</h3>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
          isAsking
            ? "bg-[#e5ebe5] text-[#718477]"
            : isMicMuted
            ? "bg-[#e5ebe5] text-[#718477]"
            : "bg-[#dcebdc] text-[#42604d]"
        }`}>
          {isAsking ? "Muted" : isMicMuted ? "Muted" : "Live"}
        </span>
      </div>

      <div className="min-h-[100px] rounded-lg border border-[#d3ded5] bg-white/80 p-4">
        {hasTranscript ? (
          <p className="whitespace-pre-wrap text-sm leading-7 text-[#263b30]">
            {transcript}
          </p>
        ) : (
          <p className="text-sm leading-7 text-[#718477]">
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
