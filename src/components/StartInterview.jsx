import { useState } from "react";
import { generateQuestionsAPI, startInterviewAPI } from "../services/interview";

const ALLOWED_FILE = [".pdf","application/pdf"]
const MAX_FILE_SIZE = 5 * 1024 * 1024

const StartInterview = ({ onClick }) => {
  const [jobTitle, setJobTitle] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [resume, setResume] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)


  const onChangeJobTitle = (e) =>{
    setJobTitle(e.target.value)
  }

  const onChangeJobDescription = (e) =>{
    setJobDescription(e.target.value)
  }

  const handleFileUpload = (e) => {
    try {
      const file = e.target.files[0];

      if (!file) {
        return;
      }

      if (!ALLOWED_FILE.includes(file.type)) {
        setError("Only PDF allowed");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("File size must be under 5mb.");
        return;
      }

      setError("");
      setResume(file);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = async(e) => {
    e.preventDefault();

    if (!jobTitle || !jobDescription || !resume) {
      setError("All fields are required!");
      return;
    }

    setLoading(true)
    setError("")

    try {
      // generate question endpoint
      const formData = new FormData()
      formData.append("job_title", jobTitle)
      formData.append("job_description", jobDescription)
      formData.append("resume", resume)

      const resp = await generateQuestionsAPI(formData)
      // Start interview endpoint

      const data = await startInterviewAPI(resp.session_id)
      setLoading(false)
      onClick(data, resp.session_id)

    } catch (error) {
      console.error("Error:", error);
    }
    finally{
      setLoading(false)
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-4 border-indigo-400/30 border-t-indigo-400 animate-spin" />
          <h1 className="text-2xl font-bold">Your interview is being prepared</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            We are reviewing your resume and creating questions tailored to the role. This may take a moment.
          </p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 py-10">
      <form onSubmit={handleFormSubmit} className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-2xl">
            🤖
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            AI Interview
          </h1>

          {error && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <span className="text-lg">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <p className="mt-2 text-sm text-slate-400">
            Prepare for your interview with an AI-powered mock interview.
          </p>
        </div>

        {/* Job Title */}
        <div className="mb-6">
          <label
            htmlFor="job-title"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Job Title
          </label>

          <input
            id="job-title"
            type="text"
            placeholder="e.g. React Developer"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            value={jobTitle}
            onChange={onChangeJobTitle}
          />
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <label
            htmlFor="job-description"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Job Description
          </label>

          <textarea
            id="job-description"
            rows={6}
            placeholder="Paste the job description here..."
            required
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            value={jobDescription}
            onChange={onChangeJobDescription}
          />
        </div>

        {/* Resume */}
        <div className="mb-8">
          <label
            htmlFor="resume"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Resume <span className="text-slate-500">(PDF)</span>
          </label>

          <label
            htmlFor="resume"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/40 px-6 py-8 text-center transition hover:border-indigo-500 hover:bg-indigo-500/5"
          >
            <div className="mb-3 text-3xl">📄</div>

            {resume ? (
              <p className="max-w-full truncate text-sm font-medium text-slate-200">
                {resume.name}
              </p>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-200">
                  Upload your resume
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  PDF files only
                </p>
              </>
            )}

            <input
              id="resume"
              type="file"
              accept=".pdf,application/pdf"
              required
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Start Button */}
        <button
          type="submit"
          // onClick={onClick}
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.99]"
        >
          Start Interview →
        </button>
      </form>
    </div>
  );
};

export default StartInterview;

