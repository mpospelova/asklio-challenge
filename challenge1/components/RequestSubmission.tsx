import React from "react";
import SubmissionForm from "./SubmissionForm";

function RequestSubmission() {
  return (
    <div className="flex justify-center h-screen m-2">
      <div className="w-full max-w-4xl px-4">
        <h1 className="text-lg text-zinc-800 pb-2">Submit a new Request</h1>
        <div className="bg-white rounded p-2">
          <SubmissionForm />
        </div>
      </div>
    </div>
  );
}

export default RequestSubmission;
