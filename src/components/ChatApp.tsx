"use client";

import styled, { css, keyframes } from "styled-components";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { EtherShader } from "./EtherShader";
import { WhyContent } from "./WhyContent";
import { encodeInput } from "@/lib/encode";
import { trpc } from "@/lib/trpc";
import { useStickyState } from "@/lib/useStickyState";

const SEEN_WELCOME_KEY = "lovereply_seen_welcome";

type Pronoun = "she" | "he";

export const STORAGE_KEY = "lovereply_ek";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div<{ $animate?: boolean }>`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  ${(p) =>
    p.$animate &&
    css`
      animation: ${fadeIn} 0.4s ease-out;
    `}
`;

const Title = styled.h1`
  font-family: var(--font-instrument-serif), serif;
  font-size: 36px;
  font-weight: 400;
  color: #fff;
  margin-bottom: 16px;

  @media (max-height: 700px) {
    font-size: 28px;
    margin-bottom: 16px;
  }
  text-align: center;
  letter-spacing: -0.02em;
`;

const PronounToggle = styled.button<{ $active: boolean }>`
  background: ${(p) =>
    p.$active ? "rgba(255, 255, 255, 0.1)" : "transparent"};
  border: none;
  color: ${(p) => (p.$active ? "#e8a0a0" : "rgba(255, 255, 255, 0.3)")};
  padding: 2px 10px;
  border-radius: 6px;
  font-size: inherit;
  line-height: 1;
  vertical-align: baseline;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-instrument-serif), serif;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: ${(p) => (p.$active ? "#e8a0a0" : "rgba(255, 255, 255, 0.7)")};
  }
`;

const PronounRow = styled.span`
  display: inline-flex;
  gap: 4px;
  vertical-align: baseline;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  background: rgba(255, 255, 255, 0.04);

  @media (max-height: 700px) {
    min-height: 80px;
  }
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

const wiggle = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
`;

const SubmitButton = styled.button<{ $wiggle?: boolean }>`
  width: 100%;
  margin-top: 16px;
  padding: 12px 32px;
  background: #fff;
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-1px);
  }

  ${(p) =>
    p.$wiggle &&
    css`
      animation: ${wiggle} 0.4s ease-in-out;
    `}
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin: 28px 0;
`;

const KeySetupCard = styled.div`
  width: 100%;
  margin-top: 8px;
`;

const KeyLabel = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 12px;
  line-height: 1.5;
`;

const PrivacyNote = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.25);
  text-align: center;
  margin-top: 14px;
  line-height: 1.5;
`;

const WelcomeContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px;
  width: 100%;
  animation: ${fadeIn} 0.4s ease-out;
`;

const ContinueButton = styled.button`
  width: 100%;
  margin-top: 32px;
  padding: 14px 32px;
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
`;

const WhyLink = styled.a`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 20px;
  transition: color 0.2s;
  text-align: center;

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

interface ChatAppProps {
  fixedPronoun?: Pronoun;
}

export function ChatApp({ fixedPronoun }: ChatAppProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pronoun, setPronoun] = useStickyState<Pronoun>("lovereply_pronoun", fixedPronoun ?? "she");
  const [message, setMessage] = useState("");
  const [encryptedKey, setEncryptedKey] = useState<string | null>(null);
  const [showKeySetup, setShowKeySetup] = useState(false);
  const [rawKeyInput, setRawKeyInput] = useState("");
  const [wiggle, setWiggle] = useState(false);
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);

  const encryptMutation = trpc.apiKey.encrypt.useMutation();

  // Load encrypted key and welcome state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setEncryptedKey(stored);
    const seen = localStorage.getItem(SEEN_WELCOME_KEY);
    setShowWelcome(!seen);
  }, []);

  // Capture encrypted key from URL ?ek= param, store it directly
  useEffect(() => {
    const ek = searchParams.get("ek");
    if (!ek) return;

    localStorage.setItem(STORAGE_KEY, ek);
    setEncryptedKey(ek);
    router.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const navigateToReply = () => {
    const encoded = encodeInput(pronoun, message.trim());
    router.push(`/reply/${encoded}`);
  };

  const handleSubmit = () => {
    if (!message.trim()) {
      setWiggle(true);
      setTimeout(() => setWiggle(false), 400);
      return;
    }
    if (!encryptedKey) {
      setShowKeySetup(true);
      return;
    }
    navigateToReply();
  };

  const handleSaveKey = () => {
    const key = rawKeyInput.trim();
    if (!key.startsWith("sk-ant-")) return;

    encryptMutation.mutate(
      { key },
      {
        onSuccess: (data) => {
          localStorage.setItem(STORAGE_KEY, data.encryptedKey);
          setEncryptedKey(data.encryptedKey);
          setShowKeySetup(false);
          setRawKeyInput("");
          navigateToReply();
        },
      }
    );
  };

  const handleDismissWelcome = () => {
    localStorage.setItem(SEEN_WELCOME_KEY, "1");
    setShowWelcome(false);
  };

  // Don't render until we know whether to show welcome — use flex:1 to keep page height stable
  if (showWelcome === null) return <Container />;

  if (showWelcome) {
    return (
      <WelcomeContainer>
        <WhyContent title="Before you start" />
        <ContinueButton onClick={handleDismissWelcome}>
          Continue
        </ContinueButton>
      </WelcomeContainer>
    );
  }

  return (
    <Container $animate>
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
      <WhyLink href="/why">Why use this?</WhyLink>
      <TextArea
        placeholder="Paste their message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />

      {showKeySetup ? (
        <KeySetupCard>
          <Divider />
          <KeyLabel>
            To get started, paste the key you received from your partner or
            get your own at <a href="https://anthropic.com" target="_blank" rel="noopener noreferrer">anthropic.com</a>.
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
          <SubmitButton
            onClick={handleSaveKey}
            disabled={
              !rawKeyInput.trim().startsWith("sk-ant-") ||
              encryptMutation.isPending
            }
          >
            {encryptMutation.isPending ? "Setting up..." : "Continue"}
          </SubmitButton>
        </KeySetupCard>
      ) : (
        <>
          <SubmitButton
            onClick={handleSubmit}
            $wiggle={wiggle}
          >
            Help me see their side
          </SubmitButton>
          <PrivacyNote>
            Your messages are never stored. Uses your own Anthropic key.
            We only proxy to Claude — nothing is saved.
          </PrivacyNote>
        </>
      )}
    </Container>
  );
}
