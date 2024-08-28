"use client";

import { useContext } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ExtractedInformationContext } from "@/context/ExtractedInformationProvider";

function AddRequestButton() {
  const { emptyExtractedInformation } = useContext(ExtractedInformationContext);
  return (
    <Button
      asChild
      className="bg-amber-500"
      onClick={() => emptyExtractedInformation()}
    >
      <Link href="/form?action=submit">Add Request</Link>
    </Button>
  );
}

export default AddRequestButton;
