"use client";

import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { trpc } from "@/lib/trpc";
import type { Analysis } from "@/server/routers/analyze";
import { EtherShader } from "./EtherShader";

type Pronoun = "she" | "he";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

const Title = styled.h1`
  font-family: var(--font-instrument-serif), serif;
  font-size: 36px;
  font-weight: 400;
  color: #fff;
  margin-bottom: 32px;
  text-align: center;
  letter-spacing: -0.02em;
`;

const PronounToggle = styled.button<{ $active: boolean }>`
  background: ${(p) =>
    p.$active ? "rgba(255, 255, 255, 0.1)" : "transparent"};
  border: none;
  color: ${(p) =>
    p.$active ? "#fff" : "rgba(255, 255, 255, 0.3)"};
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 22px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-instrument-serif), serif;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.7);
  }
`;

const PronounRow = styled.span`
  display: inline-flex;
  gap: 4px;
  vertical-align: middle;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 15px;
  padding: 16px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
  transition: border-color 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

const SubmitButton = styled.button`
  margin-top: 16px;
  padding: 12px 32px;
  background: #fff;
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  padding: 40px 0;

  span {
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    animation: ${pulse} 1.2s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

const ResultsContainer = styled.div`
  width: 100%;
  margin-top: 32px;
`;

const InsightCard = styled.div`
  margin-bottom: 24px;
`;

const InsightLabel = styled.div`
  font-family: var(--font-instrument-serif), serif;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 6px;
`;

const InsightText = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin: 28px 0;
`;

const ReplyCard = styled.button`
  width: 100%;
  text-align: left;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  margin-bottom: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

const CopiedToast = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin-left: 8px;
`;

const StartOverButton = styled.button`
  margin-top: 24px;
  padding: 10px 24px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.25);
    color: rgba(255, 255, 255, 0.7);
  }
`;

interface ChatAppProps {
  fixedPronoun?: Pronoun;
}

export function ChatApp({ fixedPronoun }: ChatAppProps) {
  const [pronoun, setPronoun] = useState<Pronoun>(fixedPronoun ?? "she");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const analyzeMutation = trpc.analyze.analyze.useMutation({
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleSubmit = () => {
    if (!message.trim()) return;
    analyzeMutation.mutate({ message: message.trim(), pronoun });
  };

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleStartOver = () => {
    setMessage("");
    setResult(null);
    analyzeMutation.reset();
  };

  return (
    <Container>
      {!result && !analyzeMutation.isPending && (
        <>
          <EtherShader />
          <Title>
            What did{" "}
            {fixedPronoun ? (
              fixedPronoun
            ) : (
              <PronounRow>
                <PronounToggle
                  $active={pronoun === "she"}
                  onClick={() => setPronoun("she")}
                >
                  she
                </PronounToggle>
                <PronounToggle
                  $active={pronoun === "he"}
                  onClick={() => setPronoun("he")}
                >
                  he
                </PronounToggle>
              </PronounRow>
            )}{" "}
            say?
          </Title>
          <TextArea
            placeholder="Paste their message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) handleSubmit();
            }}
          />
          <SubmitButton
            onClick={handleSubmit}
            disabled={!message.trim()}
          >
            Help me reply
          </SubmitButton>
        </>
      )}

      {analyzeMutation.isPending && (
        <LoadingDots>
          <span />
          <span />
          <span />
        </LoadingDots>
      )}

      {result && (
        <ResultsContainer>
          <InsightCard>
            <InsightLabel>
              What {pronoun} is trying to communicate
            </InsightLabel>
            <InsightText>{result.tryingToCommunicate}</InsightText>
          </InsightCard>

          <InsightCard>
            <InsightLabel>What {pronoun} needs</InsightLabel>
            <InsightText>{result.needs}</InsightText>
          </InsightCard>

          <InsightCard>
            <InsightLabel>What to avoid</InsightLabel>
            <InsightText>{result.whatToAvoid}</InsightText>
          </InsightCard>

          <Divider />

          <InsightLabel style={{ marginBottom: 12 }}>
            Suggested replies
          </InsightLabel>
          {result.replies.map((reply, i) => (
            <ReplyCard key={i} onClick={() => handleCopy(reply, i)}>
              {reply}
              {copiedIndex === i && <CopiedToast>Copied!</CopiedToast>}
            </ReplyCard>
          ))}

          <StartOverButton onClick={handleStartOver}>
            Start over
          </StartOverButton>
        </ResultsContainer>
      )}

      {analyzeMutation.isError && (
        <InsightText style={{ color: "rgba(255,100,100,0.8)", marginTop: 20 }}>
          Something went wrong. Please try again.
        </InsightText>
      )}
    </Container>
  );
}
