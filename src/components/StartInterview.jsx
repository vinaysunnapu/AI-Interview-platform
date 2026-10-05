import { useState } from "react";
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
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-[#b8c7be]">
            New session
          </span>
          <select
            aria-label="Interviewer voice"
            title="Uses an Indian English voice available on your device"
            value={voiceId}
            onChange={(event) => setVoiceId(event.target.value)}
            className="max-w-32 rounded-full border border-white/15 bg-[#19382c] px-3 py-1.5 text-xs text-[#f1f5ee] outline-none focus:border-[#c6ed79] sm:max-w-none"
          >
            {INTERVIEW_VOICES.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.label}
              </option>
            ))}
          </select>
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
