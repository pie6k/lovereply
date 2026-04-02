"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhyContent } from "@/components/WhyContent";
import styled from "styled-components";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100svh;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 60px 24px;
`;

const BackLink = styled.a`
  color: rgba(255, 255, 255, 0.35);
  font-size: 14px;
  margin-bottom: 32px;
  display: inline-block;
  transition: color 0.2s;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export default function WhyPage() {
  return (
    <PageWrapper>
      <Header />
      <Container>
        <BackLink href="/">&larr; Back</BackLink>
        <WhyContent />
      </Container>
      <Footer />
    </PageWrapper>
  );
}
