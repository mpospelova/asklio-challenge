import RequestSubmission from "@/components/RequestSubmission";
import React, { FC } from "react";

interface FormProps {
  searchParams: {
    action: string;
    id?: string;
  };
}

const Form: FC<FormProps> = ({ searchParams: { action, id } }) => {
  return (
    <div>
      <RequestSubmission action={action} id={id} />
    </div>
  );
};

export default Form;
