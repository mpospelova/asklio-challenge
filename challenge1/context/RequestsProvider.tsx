import React, { ReactNode, createContext, useState } from "react";
import { ProcurementRequest } from "@/lib/validators/ProcurementRequest";

export const ProcurementRequestsContext = createContext<{
  requests: ProcurementRequest[];
  addRequest: (procurementRequest: ProcurementRequest) => void;
  changeState: (id: string, newState: string) => void;
  deleteRequest: (id: string) => void;
}>({
  requests: [],
  changeState: () => {},
  addRequest: () => {},
  deleteRequest: () => {},
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

  return (
    <ProcurementRequestsContext.Provider
      value={{
        requests,
        addRequest,
        changeState,
        deleteRequest,
      }}
    >
      {children}
    </ProcurementRequestsContext.Provider>
  );
}
