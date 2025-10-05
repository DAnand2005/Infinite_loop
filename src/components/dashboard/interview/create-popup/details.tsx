import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useInterviewers } from "@/contexts/interviewers.context";
import { InterviewBase, Question } from "@/types/interview";
import { Info } from "lucide-react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import FileUpload from "../fileUpload";
import Modal from "@/components/dashboard/Modal";
import InterviewerDetailsModal from "@/components/dashboard/interviewer/interviewerDetailsModal";
import { Interviewer } from "@/types/interviewer";

interface Props {
  open: boolean;
  setLoading: (loading: boolean) => void;
  interviewData: InterviewBase;
  setInterviewData: (interviewData: InterviewBase) => void;
  isUploaded: boolean;
  setIsUploaded: (isUploaded: boolean) => void;
  fileName: string;
  setFileName: (fileName: string) => void;
}

function DetailsPopup({
  open,
  setLoading,
  interviewData,
  setInterviewData,
  isUploaded,
  setIsUploaded,
  fileName,
  setFileName,
}: Props) {
  const { interviewers } = useInterviewers();
  const [isClicked, setIsClicked] = useState(false);
  const [openInterviewerDetails, setOpenInterviewerDetails] = useState(false);
  const [interviewerDetails, setInterviewerDetails] = useState<Interviewer>();

  const [name, setName] = useState(interviewData.name);
  const [selectedInterviewer, setSelectedInterviewer] = useState(
    interviewData.interviewer_id,
  );
  const [objective, setObjective] = useState(interviewData.objective);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(
    interviewData.is_anonymous,
  );
  const [numQuestions, setNumQuestions] = useState(
    interviewData.question_count == 0
      ? ""
      : String(interviewData.question_count),
  );
  const [duration, setDuration] = useState(interviewData.time_duration);
  const [uploadedDocumentContext, setUploadedDocumentContext] = useState("");

  const onGenrateQuestions = async () => {
    setLoading(true);

    const data = {
      name: name.trim(),
      objective: objective.trim(),
      number: numQuestions,
      context: uploadedDocumentContext,
    };

    const generatedQuestions = (await axios.post(
      "/api/generate-interview-questions",
      data,
    )) as any;

    const generatedQuestionsResponse = JSON.parse(
      generatedQuestions?.data?.response,
    );

    const updatedQuestions = generatedQuestionsResponse.questions.map(
      (question: Question) => ({
        id: uuidv4(),
        question: question.question.trim(),
        follow_up_count: 1,
      }),
    );

    const updatedInterviewData = {
      ...interviewData,
      name: name.trim(),
      objective: objective.trim(),
      questions: updatedQuestions,
      interviewer_id: selectedInterviewer,
      question_count: Number(numQuestions),
      time_duration: String(duration),
      description: generatedQuestionsResponse.description,
      is_anonymous: isAnonymous,
    };
    setInterviewData(updatedInterviewData);
  };

  const onManual = () => {
    setLoading(true);

    const updatedInterviewData = {
      ...interviewData,
      name: name.trim(),
      objective: objective.trim(),
      questions: [{ id: uuidv4(), question: "", follow_up_count: 1 }],
      interviewer_id: selectedInterviewer,
      question_count: Number(numQuestions),
      time_duration: String(duration),
      description: "",
      is_anonymous: isAnonymous,
    };
    setInterviewData(updatedInterviewData);
  };

  useEffect(() => {
    if (!open) {
      setName("");
      setSelectedInterviewer(BigInt(0));
      setObjective("");
      setIsAnonymous(false);
      setNumQuestions("");
      setDuration("");
      setIsClicked(false);
    }
  }, [open]);

  return (
    <>
      <div className="text-center w-[40rem] p-6">
        <h1 className="text-2xl font-semibold">Create an Interview</h1>
        <div className="flex flex-col justify-start items-start mt-4 text-left">
          <label className="text-sm font-medium">Interview Name:</label>
          <input
            type="text"
            className="border-b-2 focus:outline-none border-gray-400 px-1 w-full py-1 mt-1"
            placeholder="e.g. Name of the Interview"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={(e) => setName(e.target.value.trim())}
          />

          <label className="text-sm mt-4 font-medium">
            Select an Interviewer:
          </label>
          <div className="relative flex items-center mt-2 space-x-6">
            {interviewers.map((item) => (
              <div
                className="relative inline-block cursor-pointer rounded-xl shrink-0 overflow-hidden text-center"
                key={item.id}
                onClick={() => setSelectedInterviewer(item.id)}
              >
                <button
                  className="absolute top-0 right-0 z-10 m-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInterviewerDetails(item);
                    setOpenInterviewerDetails(true);
                  }}
                >
                  <Info size={18} className="text-sky-500" strokeWidth={2.2} />
                </button>
                <div
                  className={`w-24 h-24 overflow-hidden rounded-full transition-all duration-200 ${selectedInterviewer === item.id ? "border-4 border-sky-500" : ""}`}>
                  <Image
                    src={item.image}
                    alt={`Picture of ${item.name}`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-1 text-sm font-semibold">{item.name}</p>
              </div>
            ))}
          </div>

          <label className="text-sm font-medium mt-4">Objective:</label>
          <Textarea
            value={objective}
            className="h-28 mt-1 border-2 border-gray-300 w-full rounded-lg"
            placeholder="e.g. Find best candidates based on their technical skills and previous projects."
            onChange={(e) => setObjective(e.target.value)}
            onBlur={(e) => setObjective(e.target.value.trim())}
          />

          <label className="text-sm font-medium mt-4">
            Upload any documents related to the interview.
          </label>
          <div className="w-full mt-1">
            <FileUpload
              isUploaded={isUploaded}
              setIsUploaded={setIsUploaded}
              fileName={fileName}
              setFileName={setFileName}
              setUploadedDocumentContext={setUploadedDocumentContext}
            />
          </div>

          <div className="flex items-center justify-between w-full mt-6">
            <div>
              <label className="flex items-center cursor-pointer">
                <span className="text-sm font-medium">
                  Do you prefer the interviewees&apos; responses to be anonymous?
                </span>
                <Switch
                  checked={isAnonymous}
                  className="ml-4 data-[state=checked]:bg-sky-500 data-[state=unchecked]:bg-gray-200"
                  onCheckedChange={setIsAnonymous}
                />
              </label>
              <p className="text-xs text-gray-500 italic mt-1">
                Note: If not anonymous, the interviewee&apos;s email and name will be collected.
              </p>
            </div>
          </div>

          <div className="flex flex-row gap-8 justify-start w-full mt-4 items-center">
            <div className="flex flex-row justify-center items-center">
              <h3 className="text-sm font-medium">Number of Questions:</h3>
              <input
                type="number"
                step="1"
                max="5"
                min="1"
                className="border-b-2 text-center focus:outline-none border-gray-400 w-16 px-2 py-0.5 ml-3"
                value={numQuestions}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value === "" || (Number.isInteger(Number(value)) && Number(value) >= 0)) {
                    if (Number(value) > 5) value = "5";
                    setNumQuestions(value);
                  }
                }}
              />
            </div>
            <div className="flex flex-row justify-center items-center">
              <h3 className="text-sm font-medium">Duration (mins):</h3>
              <input
                type="number"
                step="1"
                max="10"
                min="1"
                className="border-b-2 text-center focus:outline-none border-gray-400 w-16 px-2 py-0.5 ml-3"
                value={duration}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value === "" || (Number.isInteger(Number(value)) && Number(value) >= 0)) {
                    if (Number(value) > 10) value = "10";
                    setDuration(value);
                  }
                }}
              />
            </div>
          </div>

          <div className="flex flex-row w-full justify-center items-center space-x-4 mt-6">
            <Button
              disabled={!name || !objective || !numQuestions || !duration || selectedInterviewer == BigInt(0) || isClicked}
              className="bg-sky-500 hover:bg-sky-600 text-white w-48 py-2 rounded-lg"
              onClick={() => {
                setIsClicked(true);
                onGenrateQuestions();
              }}
            >
              Generate Questions
            </Button>
            <Button
              disabled={!name || !objective || !numQuestions || !duration || selectedInterviewer == BigInt(0) || isClicked}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-48 py-2 rounded-lg"
              onClick={() => {
                setIsClicked(true);
                onManual();
              }}
            >
              I&apos;ll do it myself
            </Button>
          </div>
        </div>
      </div>
      <Modal
        open={openInterviewerDetails}
        closeOnOutsideClick={true}
        onClose={() => setOpenInterviewerDetails(false)}
      >
        <InterviewerDetailsModal interviewer={interviewerDetails} />
      </Modal>
    </>
  );
}

export default DetailsPopup;
