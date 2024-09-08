"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";

// 모든 페이지가 거쳐가는 파일
const queryClient = new QueryClient();

interface Props {
  children?: React.ReactNode;
}

export const NextProvider = ({ children }: Props) => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          {children}
          <ToastContainer
            autoClose={1000}
            pauseOnFocusLoss={false}
            pauseOnHover={false}
          />
          <ReactQueryDevtools />
        </SessionProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export const NextLayout = ({ children }: Props) => {
  return (
    <div className="layout">
      <Navbar />
      {children}
    </div>
  );
};
