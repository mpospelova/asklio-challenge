"use client";

import { ExtractedInformationProvider } from "@/context/ExtractedInformationProvider";
import { ProcurementRequestsProvider } from "@/context/RequestsProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ProcurementRequestsProvider>
        <ExtractedInformationProvider>{children}</ExtractedInformationProvider>
      </ProcurementRequestsProvider>
    </QueryClientProvider>
  );
};

export default Providers;
