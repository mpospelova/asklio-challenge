import React, { ReactNode, createContext, useState } from "react";
import { ExtractedInformation } from "@/lib/validators/ExtractedInformation";

export const ExtractedInformationContext = createContext<{
  extractedInformation: ExtractedInformation;
  addExtractedInformation: (information: ExtractedInformation) => void;
}>({
  extractedInformation: {
    requestorName: "",
    title: "",
    vendorName: "",
    vatID: "",
    commodityGroup: "",
    department: "",
    orderLines: [],
    totalCost: "",
  },
  addExtractedInformation: () => {},
});

export function ExtractedInformationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [extractedInformation, setExtractedInformation] =
    useState<ExtractedInformation>({
      requestorName: "",
      title: "",
      vendorName: "",
      vatID: "",
      commodityGroup: "",
      department: "",
      orderLines: [],
      totalCost: "",
    });

  const addExtractedInformation = (information: ExtractedInformation) => {
    setExtractedInformation(information);
  };

  return (
    <ExtractedInformationContext.Provider
      value={{
        extractedInformation,
        addExtractedInformation,
      }}
    >
      {children}
    </ExtractedInformationContext.Provider>
  );
}
