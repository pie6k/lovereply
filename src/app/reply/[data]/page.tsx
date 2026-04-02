"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { trpc } from "@/lib/trpc";
import { decodeInput } from "@/lib/encode";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { STORAGE_KEY } from "@/components/ChatApp";
import { EtherShader } from "@/components/EtherShader";
import { BoldText } from "@/components/BoldText";
import { analysisSchema } from "@/app/api/analyze/route";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100svh;
`;

const Container = styled.div<{ $top?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${(p) => (p.$top ? "flex-start" : "center")};
  padding: 40px 24px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const SkeletonLine = styled.div<{ $width?: string }>`
  height: 16px;
  width: ${(p) => p.$width ?? "100%"};
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.04) 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  margin-bottom: 8px;
`;

const SkeletonCard = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 10px;
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

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin: 28px 0;
`;

const ReplyCard = styled.div`
  width: 100%;
  text-align: left;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 15px;
  line-height: 1.5;
  font-family: inherit;
  margin-bottom: 10px;
  user-select: none;
  -webkit-user-select: none;
`;

const ExamplesNote = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 16px;
  font-style: italic;
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

function ReplySkeleton() {
  return (
    <SkeletonCard>
      <SkeletonLine $width="90%" />
      <SkeletonLine $width="70%" />
    </SkeletonCard>
  );
}

function InsightSkeleton() {
  return (
    <InsightCard>
      <SkeletonLine $width="50%" style={{ height: 20, marginBottom: 12 }} />
      <SkeletonLine $width="95%" />
      <SkeletonLine $width="80%" />
    </InsightCard>
  );
}

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
  const [started, setStarted] = useState(false);

  const encryptMutation = trpc.apiKey.encrypt.useMutation();

  const { object, submit, isLoading, error } = useObject({
    api: "/api/analyze",
    schema: analysisSchema,
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
    if (started || !encryptedKey || !decoded) return;
    setStarted(true);
    submit({
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

  if (!decoded) {
    return (
      <PageWrapper>
        <Header />
        <Container>
          <ErrorText>Invalid link.</ErrorText>
          <ActionButton onClick={() => router.push("/")}>Go home</ActionButton>
        </Container>
        <Footer />
      </PageWrapper>
    );
  }

  const replies = object?.replies ?? [];
  const hasAnyData = replies.length > 0 || object?.tryingToCommunicate;
  const isComplete = !isLoading && object?.whatToAvoid;

  return (
    <PageWrapper>
      <Container $top={!!hasAnyData}>
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

        {!needsKey && !hasAnyData && isLoading && (
          <EtherShader />
        )}

        {!needsKey && (hasAnyData || isLoading) && (
          <ResultsContainer>
            {object?.tryingToCommunicate ? (
              <InsightCard>
                <InsightLabel>
                  What {decoded.pronoun} is trying to communicate
                </InsightLabel>
                <BoldText>{object.tryingToCommunicate}</BoldText>
              </InsightCard>
            ) : (
              isLoading && <InsightSkeleton />
            )}

            {object?.needs ? (
              <InsightCard>
                <InsightLabel>What {decoded.pronoun} needs</InsightLabel>
                <BoldText>{object.needs}</BoldText>
              </InsightCard>
            ) : (
              isLoading && <InsightSkeleton />
            )}

            {object?.whatToAvoid ? (
              <InsightCard>
                <InsightLabel>What to avoid</InsightLabel>
                <BoldText>{object.whatToAvoid}</BoldText>
              </InsightCard>
            ) : (
              isLoading && <InsightSkeleton />
            )}

            <Divider />

            <InsightLabel style={{ marginBottom: 8 }}>
              Example replies
            </InsightLabel>
            <ExamplesNote>
              Use these as inspiration, but write your reply in your own words —
              it&apos;ll mean so much more coming from you.
            </ExamplesNote>

            {replies.map(
              (reply, i) =>
                reply && (
                  <ReplyCard key={i}>
                    {reply}
                  </ReplyCard>
                )
            )}
            {isLoading && replies.filter(Boolean).length < 3 && (
              <>
                {Array.from({ length: 3 - replies.filter(Boolean).length }).map(
                  (_, i) => (
                    <ReplySkeleton key={`rs-${i}`} />
                  )
                )}
              </>
            )}

            {isComplete && (
              <ActionButton onClick={() => router.push("/")}>
                Start over
              </ActionButton>
            )}
          </ResultsContainer>
        )}

        {error && (
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
