import { NextProvider, NextLayout } from "./providers";
import "@/styles/globals.css";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next Map",
  description: "Next js 14를 이용한 맛집 앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextProvider>
          <NextLayout>{children}</NextLayout>
        </NextProvider>
      </body>
    </html>
  );
}
