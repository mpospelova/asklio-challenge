import React, { ReactNode, createContext, useState } from "react";
import { ProcurementRequest } from "@/lib/validators/ProcurementRequest";
import { ExtractedInformation } from "@/lib/validators/ExtractedInformation";

export const ProcurementRequestsContext = createContext<{
  requests: ProcurementRequest[];
  addRequest: (procurementRequest: ProcurementRequest) => void;
  changeState: (id: string, newState: string) => void;
  deleteRequest: (id: string) => void;
  updateInformation: (newInformation: ExtractedInformation, id: string) => void;
}>({
  requests: [],
  changeState: () => {},
  addRequest: () => {},
  deleteRequest: () => {},
  updateInformation: () => {},
});

export function ProcurementRequestsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);

  const addRequest = (request: ProcurementRequest) => {
    setRequests((prev) => [...prev, request]);
  };

  const changeState = (id: string, newState: string) => {
    setRequests((prev) =>
      prev.map((request) => {
        if (request.id === id) {
          return {
            ...request,
            state: newState,
            modifiedAt: new Date().toLocaleString(),
          };
        } else {
          return request;
        }
      })
    );
  };

  const deleteRequest = (id: string) => {
    setRequests((prev) => prev.filter((request) => request.id !== id));
  };

  const updateInformation = (
    newInformation: ExtractedInformation,
    id: string
  ) => {
    const previous = requests.filter((request) => request.id === id)[0];
    const newRequest: ProcurementRequest = {
      extractedInformation: newInformation,
      createdAt: previous.createdAt,
      modifiedAt: new Date().toLocaleString(),
      id: id,
      state: previous.state,
    };

    setRequests((prev) => prev.filter((request) => request.id !== id));
    setRequests((prev) => [...prev, newRequest]);
  };

  return (
    <ProcurementRequestsContext.Provider
      value={{
        requests,
        addRequest,
        changeState,
        deleteRequest,
        updateInformation,
      }}
    >
      {children}
    </ProcurementRequestsContext.Provider>
  );
}
