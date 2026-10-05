import { useEffect, useRef, useState } from "react";
import listening from "../assets/images/listening.gif";
import { generateQuestionsAPI, startInterviewAPI } from "../services/interview";
import { INTERVIEW_VOICES } from "../util/audio";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const StartInterview = ({ onClick }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceId, setVoiceId] = useState(INTERVIEW_VOICES[0].id);
  const [isVoiceMenuOpen, setIsVoiceMenuOpen] = useState(false);
  const voiceMenuRef = useRef(null);
  const voiceTriggerRef = useRef(null);
  const voiceOptionRefs = useRef([]);
  const selectedVoice = INTERVIEW_VOICES.find((voice) => voice.id === voiceId);

  useEffect(() => {
    if (!isVoiceMenuOpen) {
      return undefined;
    }

    const closeOnOutsideClick = (event) => {
      if (!voiceMenuRef.current?.contains(event.target)) {
        setIsVoiceMenuOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsVoiceMenuOpen(false);
        voiceTriggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isVoiceMenuOpen]);

  useEffect(() => {
    if (isVoiceMenuOpen) {
      const selectedIndex = INTERVIEW_VOICES.findIndex((voice) => voice.id === voiceId);
      voiceOptionRefs.current[selectedIndex]?.focus();
    }
  }, [isVoiceMenuOpen, voiceId]);

  const handleVoiceOptionKeyDown = (event, index) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex =
        (index + direction + INTERVIEW_VOICES.length) % INTERVIEW_VOICES.length;
      voiceOptionRefs.current[nextIndex]?.focus();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setResume(null);
      setError("Choose a PDF file for your resume.");
      event.currentTarget.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setResume(null);
      setError("Your resume must be smaller than 5 MB.");
      event.currentTarget.value = "";
      return;
    }

    setError("");
    setResume(file);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!jobTitle.trim() || !jobDescription.trim() || !resume) {
      setError("Complete each field and add your resume to continue.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("job_title", jobTitle.trim());
      formData.append("job_description", jobDescription.trim());
      formData.append("resume", resume);

      const response = await generateQuestionsAPI(formData);
      if (!response?.session_id) {
        setError("We couldn't prepare your interview. Please try again.");
        return;
      }

      const interview = await startInterviewAPI(response.session_id);
      if (!interview) {
        setError("We couldn't start your interview. Please try again.");
        return;
      }

      onClick(interview, response.session_id, voiceId);
    } catch (requestError) {
      console.error("Interview setup failed:", requestError);
      setError("Something went wrong while preparing your interview. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const resumeSize = resume
    ? `${(resume.size / (1024 * 1024)).toFixed(1)} MB`
    : "PDF, up to 5 MB";

  return (
    <div className="min-h-screen bg-[#10211d] text-[#f1f5ee]">
      <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-5 md:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c6ed79] text-sm font-bold text-[#10211d]">
            AI
          </span>
          <span className="text-sm font-semibold">Interview Studio</span>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-[#19382c]/80 px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
          <span className="rounded-full bg-[#c6ed79]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d9f4a9]">
            New session
          </span>
          <div className="relative" ref={voiceMenuRef}>
            <button
              ref={voiceTriggerRef}
              type="button"
              aria-label={`Interviewer voice: ${selectedVoice.label}`}
              aria-haspopup="listbox"
              aria-expanded={isVoiceMenuOpen}
              onClick={() => setIsVoiceMenuOpen((open) => !open)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  setIsVoiceMenuOpen(true);
                }
              }}
              className="flex min-h-10 items-center gap-2 rounded-full border border-[#c6ed79]/25 bg-[#10211d] px-3.5 text-xs font-semibold text-[#f1f5ee] shadow-sm transition hover:border-[#c6ed79]/60 hover:bg-[#173027] focus:outline-none focus:ring-2 focus:ring-[#c6ed79]/30"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-[#c6ed79]"
                aria-hidden="true"
              >
                <path d="M9 4L5 7H2.5V13H5L9 16V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M12 7C13.7 8.7 13.7 11.3 12 13M14.5 4.5C17.5 7.5 17.5 12.5 14.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>{selectedVoice.label}</span>
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3.5 w-3.5 text-[#91a59a] transition-transform ${isVoiceMenuOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {isVoiceMenuOpen && (
              <div
                role="listbox"
                aria-label="Choose interviewer voice"
                className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#153027] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.4)] ring-1 ring-black/20"
              >
                <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#91a59a]">
                  Interviewer voice
                </p>
                {INTERVIEW_VOICES.map((voice, index) => {
                  const isSelected = voice.id === voiceId;

                  return (
                    <button
                      key={voice.id}
                      ref={(element) => {
                        voiceOptionRefs.current[index] = element;
                      }}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={-1}
                      onClick={() => {
                        setVoiceId(voice.id);
                        setIsVoiceMenuOpen(false);
                        voiceTriggerRef.current?.focus();
                      }}
                      onKeyDown={(event) => handleVoiceOptionKeyDown(event, index)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition focus:outline-none focus:ring-1 focus:ring-[#c6ed79]/50 ${
                        isSelected
                          ? "bg-[#c6ed79]/10 text-[#d9f4a9]"
                          : "text-[#d5dfd7] hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{voice.label}</span>
                      {isSelected && (
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-[#c6ed79]"
                          aria-hidden="true"
                        >
                          <path d="M4 10.5L8 14L16 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-5 py-6 md:px-8 lg:min-h-[calc(100vh-81px)] lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-10">
        <section className="order-2 lg:order-1" aria-labelledby="page-title">
          <p className="mb-5 flex items-center gap-2 text-sm font-medium text-[#c6ed79]">
            <span className="h-2 w-2 rounded-full bg-[#c6ed79]" />
            Mock interview
          </p>
          <h1
            id="page-title"
            className="max-w-xl font-serif text-5xl leading-[1.05] text-[#f1f5ee] sm:text-6xl"
          >
            Practice for the role you want.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-[#b8c7be]">
            Set the role, add the job details, and get ready to speak with confidence.
          </p>

          <div className="mt-8 flex items-center justify-between border-y border-white/15 py-5 sm:mt-12">
            <div>
              <p className="text-sm font-semibold text-[#f1f5ee]">Interviewer ready</p>
              <p className="mt-1 text-sm text-[#91a59a]">Your practice starts here</p>
            </div>
            <img
              src={listening}
              alt=""
              aria-hidden="true"
              className="h-24 w-36 object-contain mix-blend-screen sm:h-32 sm:w-44"
            />
          </div>
        </section>

        <form
          onSubmit={handleFormSubmit}
          className="order-1 rounded-lg bg-[#edf3ee] p-5 text-[#162821] shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-8 lg:order-2 lg:p-10"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#4d6a59]">01 / Setup</p>
              <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
                Start an interview
              </h2>
            </div>
            <span className="mt-1 hidden rounded-full bg-[#dce9de] px-3 py-1.5 text-xs font-medium text-[#42604d] sm:inline-flex">
              Takes about a minute
            </span>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-lg border border-[#e4b7a5] bg-[#fff3ed] px-4 py-3 text-sm text-[#8b3929]"
            >
              <span aria-hidden="true" className="font-bold">!</span>
              <p>{error}</p>
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="job-title"
              className="mb-2 block text-sm font-semibold text-[#263b30]"
            >
              Job title
            </label>
            <input
              id="job-title"
              type="text"
              placeholder="e.g. Product Designer"
              required
              autoComplete="organization-title"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              className="min-h-12 w-full rounded-lg border border-[#c5d2c8] bg-white px-4 py-3 text-[#162821] outline-none transition placeholder:text-[#84968a] focus:border-[#567b55] focus:ring-2 focus:ring-[#567b55]/20"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="job-description"
              className="mb-2 block text-sm font-semibold text-[#263b30]"
            >
              Job description
            </label>
            <textarea
              id="job-description"
              rows={4}
              placeholder="Paste the role description..."
              required
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              className="min-h-32 w-full resize-y rounded-lg border border-[#c5d2c8] bg-white px-4 py-3 text-[#162821] outline-none transition placeholder:text-[#84968a] focus:border-[#567b55] focus:ring-2 focus:ring-[#567b55]/20"
            />
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="resume" className="text-sm font-semibold text-[#263b30]">
                Resume
              </label>
              <span className="text-xs text-[#6f8475]">{resumeSize}</span>
            </div>

            <label
              htmlFor="resume"
              className="group flex min-h-24 cursor-pointer items-center gap-4 rounded-lg border border-dashed border-[#aebfb2] bg-white/75 px-4 py-4 transition hover:border-[#567b55] hover:bg-white focus-within:border-[#567b55] focus-within:ring-2 focus-within:ring-[#567b55]/20"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#fbe4d8] text-xs font-bold text-[#a74e31]">
                PDF
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-[#263b30]">
                  {resume ? resume.name : "Choose a resume"}
                </span>
                <span className="mt-1 block text-xs text-[#718477]">
                  {resume ? "Select another file to replace it" : "PDF document"}
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-[#42604d] group-hover:text-[#263b30]">
                Browse
              </span>
              <input
                id="resume"
                type="file"
                accept=".pdf,application/pdf"
                required={!resume}
                className="sr-only"
                onChange={handleFileUpload}
              />
            </label>

            {resume && (
              <button
                type="button"
                onClick={() => setResume(null)}
                className="mt-2 text-xs font-medium text-[#6f8475] underline decoration-[#aebfb2] underline-offset-4 hover:text-[#263b30]"
              >
                Remove resume
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#17392b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24543e] focus:outline-none focus:ring-2 focus:ring-[#567b55] focus:ring-offset-2 active:scale-[0.99] disabled:cursor-wait disabled:opacity-75"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Preparing interview
              </>
            ) : (
              <>
                Start interview
                <span aria-hidden="true" className="text-lg leading-none">→</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

export default StartInterview;
