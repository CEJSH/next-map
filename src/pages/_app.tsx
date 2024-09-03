import Layout from "@/components/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
// 모든 페이지가 거쳐가는 파일
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
