"use client";

import styled from "styled-components";

const Section = styled.h2`
  font-family: var(--font-instrument-serif), serif;
  font-size: 30px;
  font-weight: 400;
  margin-top: 28px;
  margin-bottom: 10px;
`;

const Text = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
`;

const Title = styled.h1`
  font-family: var(--font-instrument-serif), serif;
  font-size: 32px;
  font-weight: 400;
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 17px;
  line-height: 1.7;
  margin-bottom: 40px;
  font-style: italic;
`;

interface WhyContentProps {
  title?: string;
}

export function WhyContent({ title = "Why LoveReply?" }: WhyContentProps) {
  return (
    <>
      <Title>{title}</Title>
      <Subtitle>
        This is not a replacement for genuine human connection. It&apos;s a
        mirror for the blind spots we all have.
      </Subtitle>

      <Section>We all have blind spots</Section>
      <Text>
        In long relationships, we develop patterns. We get tired of certain
        topics, we stop hearing what&apos;s really being said, and when things
        get tense, our defenses go up. It&apos;s not that we stop caring — we
        just lose perspective. These blind spots are completely normal, and
        almost impossible to see on our own.
      </Text>

      <Section>Fresh perspective lowers our guard</Section>
      <Text>
        Have you ever watched a YouTube video or read something from a stranger
        that suddenly made you understand a situation you&apos;ve been stuck in?
        It&apos;s often easier to accept a new point of view from a neutral
        source than from the person we&apos;re in conflict with. That&apos;s not
        a flaw — it&apos;s just how we work. When the insight comes from a place
        with no history, no baggage, no score to settle, we can actually hear
        it.
      </Text>

      <Section>Enhance, not replace</Section>
      <Text>
        LoveReply is meant to help you see what you might be missing — to
        understand what your partner is really trying to say beneath the words
        they chose. The goal is not to make you lazy or robotic in your
        responses. It&apos;s to spark that &ldquo;oh, I hadn&apos;t thought of
        it that way&rdquo; moment, so you can show up in your relationship with
        more empathy and clarity.
      </Text>
      <Text>
        Think of it as a gentle nudge, not a script. The real reply should
        always come from you.
      </Text>
    </>
  );
}
