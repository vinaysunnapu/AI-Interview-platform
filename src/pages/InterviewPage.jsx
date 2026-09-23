import { useEffect, useState } from "react";
import { APP_CONSTANT } from "../util/constant";
import StartInterview from "../components/StartInterview";
import { startInterviewAPI, submitApi, reportApi, endInterviewApi } from "../services/interview";
import { playAudio, stopAudio } from "../util/audio";
import Interview from "../components/Interview";
import { useSpeechToText } from "../hooks/useSpeechToText";
import Report from "../components/Report";
const InterviewPage = () => {
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState(APP_CONSTANT.IDLE);
  const [question, setQuestion] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false)

  const onAutoSubmit = async(finalText) =>{
    stopListening();

    if(!finalText.trim()){
        return
    }

    // sumbit end point

    const payload = {
        "session_id": sessionId,
        "answer": finalText,
        "skip": false
    }

    const data = await submitApi(payload)

    if (!data) {
      console.error("Answer submission failed")
      return
    }

    if (data.InterviewEnded){
        // generate report
        finishInterview()
    }
    else{
        // Ask next question
        setQuestion(data.nextQuestion)
        setStatus(APP_CONSTANT.ASKING)
    }

  }

  const {startListening, stopListening} = useSpeechToText(onAutoSubmit)

  useEffect(()=>{

    if (status === APP_CONSTANT.ASKING){
        playAudio(question, ()=>{
            setStatus(APP_CONSTANT.LISTENING)

            // TODO: STT
            startListening()
        })
    }

  },[status, question])

  const startInterview = async(data, session_id) => {
  setLoading(false)

  // response sessionId, status, question
  setSessionId(session_id);
  setQuestion(data.firstQuestion);

  setStatus(APP_CONSTANT.INTRO);
  
  const introText = data.introText
  playAudio(introText, ()=>{
    setStatus(APP_CONSTANT.ASKING)
  });
};

const skipQuestion = async() => {
    stopListening()

    // sumbit end point

    const payload = {
        "session_id": sessionId,
        "answer": "",
        "skip": true
    }

    const data = await submitApi(payload)

    if (data.InterviewEnded){
        // generate report
        finishInterview()
    }
    else{
        // Ask next question
        setQuestion(data.nextQuestion)
        setStatus(APP_CONSTANT.ASKING)
    }

}

const endInterview = async() => {
  stopAudio();
    stopListening();

    await endInterviewApi(sessionId)
    await finishInterview()
}

const finishInterview = async() => {
    setLoading(true)
    //call report end point

    const data = await reportApi(sessionId)

    if(!data){
    setLoading(false)
        return
    }

    setReport(data.result)
  setStatus(APP_CONSTANT.COMPLETED)
    setLoading(false)
}


  return (
    <>
      {loading ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-sm font-medium text-indigo-400">
          <div className="flex items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400/30 border-t-indigo-400" />
            <span>Generating your report...</span>
          </div>
        </div>
      ) : (
        <>
          {status === APP_CONSTANT.IDLE && <StartInterview onClick={startInterview}/>} 
          {(status === APP_CONSTANT.INTRO ||
            status === APP_CONSTANT.ASKING ||
            status === APP_CONSTANT.LISTENING) && (
            <Interview
              skipQuestion={skipQuestion}
              endInterview={endInterview}
              state={status}
            />
          )}
          {status === APP_CONSTANT.COMPLETED && <Report report={report}/>} 
        </>
      )}
    </>
  );
};

export default InterviewPage;
