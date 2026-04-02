"use client";

import { useState } from "react";
import styled from "styled-components";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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

const Title = styled.h1`
  font-family: var(--font-instrument-serif), serif;
  font-size: 32px;
  font-weight: 400;
  color: #fff;
  margin-bottom: 12px;
  text-align: center;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-bottom: 32px;
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

const GenerateButton = styled.button`
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

const LinkBox = styled.div`
  width: 100%;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const LinkText = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const CopyButton = styled.button`
  background: #fff;
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    opacity: 0.9;
  }
`;

const Label = styled.label`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 8px;
  align-self: flex-start;
`;

const BackLink = styled.a`
  color: rgba(255, 255, 255, 0.35);
  font-size: 14px;
  margin-bottom: 32px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export default function SharePage() {
  const [key, setKey] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const encryptMutation = trpc.apiKey.encrypt.useMutation({
    onSuccess: (data) => {
      setShareUrl(
        `https://lovereply.ai/${encodeURIComponent(data.encryptedKey)}`
      );
    },
  });

  const handleGenerate = () => {
    const trimmed = key.trim();
    if (!trimmed.startsWith("sk-ant-")) return;
    encryptMutation.mutate({ key: trimmed });
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageWrapper>
      <Container>
        <BackLink href="/">&larr; Back</BackLink>
        <Title>Share with your partner</Title>
        <Subtitle>
          Paste your Anthropic API key below to generate a secure link. Send it
          to your partner and they can start using LoveReply right away — no
          setup needed on their end. Your key is encrypted before being included
          in the link. We never store your key on our servers — it is only ever
          kept in your browser&apos;s local storage.
        </Subtitle>
        <Label>Your Anthropic API key</Label>
        <Input
          type="text"
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          placeholder="sk-ant-..."
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setShareUrl("");
          }}
        />
        {!shareUrl && (
          <GenerateButton
            onClick={handleGenerate}
            disabled={
              !key.trim().startsWith("sk-ant-") || encryptMutation.isPending
            }
          >
            {encryptMutation.isPending ? "Generating..." : "Generate link"}
          </GenerateButton>
        )}
        {shareUrl && (
          <LinkBox>
            <LinkText>{shareUrl}</LinkText>
            <CopyButton onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </CopyButton>
          </LinkBox>
        )}
      </Container>
      <Footer />
    </PageWrapper>
  );
}
