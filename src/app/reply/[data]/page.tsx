"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";
import { trpc } from "@/lib/trpc";
import { decodeInput } from "@/lib/encode";
import { Footer } from "@/components/Footer";
import type { Analysis } from "@/server/routers/analyze";
import { STORAGE_KEY } from "@/components/ChatApp";
import { EtherShader } from "@/components/EtherShader";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100svh;
`;

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
`;

const InsightCard = styled.div`
  margin-bottom: 24px;
`;

const InsightLabel = styled.div`
  font-family: var(--font-instrument-serif), serif;
  font-size: 22px;
  color: #fff;
  margin-bottom: 8px;
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

const ActionButton = styled.button`
  width: 100%;
  margin-top: 24px;
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

const ErrorText = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 100, 100, 0.8);
  margin-top: 20px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 15px;
  padding: 14px 16px;
  font-family: inherit;
  transition: border-color 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

const KeyLabel = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 12px;
  line-height: 1.5;
`;

export default function ReplyPage({
  params,
}: {
  params: Promise<{ data: string }>;
}) {
  const { data } = use(params);
  const router = useRouter();
  const decoded = decodeInput(data);

  const [encryptedKey, setEncryptedKey] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState(false);
  const [rawKeyInput, setRawKeyInput] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [started, setStarted] = useState(false);

  const encryptMutation = trpc.apiKey.encrypt.useMutation();
  const analyzeMutation = trpc.analyze.analyze.useMutation({
    onSuccess: (data) => setResult(data),
  });

  // Load key from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEncryptedKey(stored);
    } else {
      setNeedsKey(true);
    }
  }, []);

  // Auto-analyze once we have key + decoded input
  useEffect(() => {
    if (started || !encryptedKey || !decoded || analyzeMutation.isPending) return;
    setStarted(true);
    analyzeMutation.mutate({
      message: decoded.message,
      pronoun: decoded.pronoun,
      encryptedKey,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encryptedKey, decoded]);

  const handleSaveKey = () => {
    const key = rawKeyInput.trim();
    if (!key.startsWith("sk-ant-")) return;

    encryptMutation.mutate(
      { key },
      {
        onSuccess: (data) => {
          localStorage.setItem(STORAGE_KEY, data.encryptedKey);
          setEncryptedKey(data.encryptedKey);
          setNeedsKey(false);
          setRawKeyInput("");
        },
      }
    );
  };

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!decoded) {
    return (
      <PageWrapper>
        <Container>
          <ErrorText>Invalid link.</ErrorText>
          <ActionButton onClick={() => router.push("/")}>
            Go home
          </ActionButton>
        </Container>
        <Footer />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        {needsKey && (
          <>
            <KeyLabel>
              To get started, paste the key you received from your partner or
              get your own at anthropic.com.
            </KeyLabel>
            <Input
              type="text"
              autoComplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-form-type="other"
              placeholder="Paste your key here..."
              value={rawKeyInput}
              onChange={(e) => setRawKeyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveKey();
              }}
            />
            <ActionButton
              onClick={handleSaveKey}
              disabled={
                !rawKeyInput.trim().startsWith("sk-ant-") ||
                encryptMutation.isPending
              }
            >
              {encryptMutation.isPending ? "Setting up..." : "Continue"}
            </ActionButton>
          </>
        )}

        {!needsKey && analyzeMutation.isPending && (
          <>
            <EtherShader />
            <LoadingDots>
              <span />
              <span />
              <span />
            </LoadingDots>
          </>
        )}

        {result && (
          <ResultsContainer>
            <InsightLabel style={{ marginBottom: 12 }}>
              Suggested replies
            </InsightLabel>
            {result.replies.map((reply, i) => (
              <ReplyCard key={i} onClick={() => handleCopy(reply, i)}>
                {reply}
                {copiedIndex === i && <CopiedToast>Copied!</CopiedToast>}
              </ReplyCard>
            ))}

            <Divider />

            <InsightCard>
              <InsightLabel>
                What {decoded.pronoun} is trying to communicate
              </InsightLabel>
              <InsightText>{result.tryingToCommunicate}</InsightText>
            </InsightCard>

            <InsightCard>
              <InsightLabel>What {decoded.pronoun} needs</InsightLabel>
              <InsightText>{result.needs}</InsightText>
            </InsightCard>

            <InsightCard>
              <InsightLabel>What to avoid</InsightLabel>
              <InsightText>{result.whatToAvoid}</InsightText>
            </InsightCard>

            <ActionButton onClick={() => router.push("/")}>
              Start over
            </ActionButton>
          </ResultsContainer>
        )}

        {analyzeMutation.isError && (
          <>
            <ErrorText>Something went wrong. Please try again.</ErrorText>
            <ActionButton onClick={() => router.push("/")}>
              Go home
            </ActionButton>
          </>
        )}
      </Container>
      <Footer />
    </PageWrapper>
  );
}
