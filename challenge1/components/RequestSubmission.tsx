import SubmissionForm from "./SubmissionForm";
import FileUploaderTile from "./FileUploaderTile";
import { FC } from "react";

interface RequestSubmissionProps {
  action: string;
  id?: string;
}

const RequestSubmission: FC<RequestSubmissionProps> = ({ action, id }) => {
  return (
    <div className="flex justify-center h-screen m-2">
      <div className="w-full max-w-4xl px-4">
        <h1 className="text-lg text-zinc-800 pb-2 font-bold">
          Submit a new Request
        </h1>
        <div className="bg-white rounded p-2">
          <FileUploaderTile />
          <SubmissionForm action={action} id={id} />
        </div>
      </div>
    </div>
  );
};

export default RequestSubmission;
