"use client";

import { Suspense } from "react";
import styled from "styled-components";
import { Footer } from "@/components/Footer";
import { ChatApp } from "@/components/ChatApp";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100svh;
`;

export default function Home() {
  return (
    <PageWrapper>
      <Suspense>
        <ChatApp />
      </Suspense>
      <Footer />
    </PageWrapper>
  );
}
