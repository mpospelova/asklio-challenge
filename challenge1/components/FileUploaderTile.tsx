"use client";
import { useContext, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ExtractedInformationContext } from "@/context/ExtractedInformationProvider";

const FileUploaderTile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const { extractedInformation, addExtractedInformation } = useContext(
    ExtractedInformationContext
  );

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    setUploadStatus("");
    if (!selectedFile) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { extractedInformation } = await response.json();
        setUploadStatus("File uploaded successfully!");
        addExtractedInformation(extractedInformation);
      } else {
        setUploadStatus("Failed to upload file.");
      }
    } catch (error) {
      setUploadStatus("An error occurred during upload.");
    }
  };

  return (
    <div className="w-full mx-auto pb-3">
      <div className="flex gap-x-4">
        <Input type="file" accept=".pdf" onChange={handleFileChange} />
        <Button onClick={handleUpload}> Upload File</Button>
      </div>

      {uploadStatus && <p className="mt-4 text-red-500">{uploadStatus}</p>}
    </div>
  );
};

export default FileUploaderTile;
