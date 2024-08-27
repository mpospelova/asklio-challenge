"use client";

import { ExtractedInformationProvider } from "@/context/ExtractedInformationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ExtractedInformationProvider>{children}</ExtractedInformationProvider>
    </QueryClientProvider>
  );
};

export default Providers;
