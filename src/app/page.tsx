"use client";

import { Suspense } from "react";
import styled from "styled-components";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatApp } from "@/components/ChatApp";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
`;

export default function Home() {
  return (
    <PageWrapper>
      <Header />
      <Suspense>
        <ChatApp />
      </Suspense>
      <Footer />
    </PageWrapper>
  );
}
