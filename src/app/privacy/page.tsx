"use client";

import styled from "styled-components";

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

const Title = styled.h1`
  font-family: var(--font-instrument-serif), serif;
  font-size: 32px;
  font-weight: 400;
  margin-bottom: 32px;
`;

const Section = styled.h2`
  font-family: var(--font-instrument-serif), serif;
  font-size: 20px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 28px;
  margin-bottom: 10px;
`;

const Text = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
`;

export default function PrivacyPage() {
  return (
    <Container>
      <BackLink href="/">&larr; Back</BackLink>
      <Title>Privacy Policy</Title>
      <Text>Last updated: April 2026</Text>

      <Section>No data collection</Section>
      <Text>
        LoveReply does not collect, store, or retain any personal data. We do
        not create user accounts. We do not use cookies, analytics, or any form
        of tracking. We do not log the messages you submit or the responses you
        receive.
      </Text>

      <Section>Your API key</Section>
      <Text>
        LoveReply operates using your own Anthropic API key. You provide your
        key either by pasting it directly or by receiving a link from someone who
        shared theirs. Your key is encrypted client-side before being stored in
        your browser&apos;s local storage. The raw key is never saved in plain text on
        your device or on our servers.
      </Text>
      <Text>
        When you submit a message, your encrypted key is sent to our server
        solely for the purpose of decrypting it in memory and forwarding your
        request to Anthropic&apos;s API on your behalf. We do not log, store, or
        retain your API key or any request data beyond the duration of a single
        request.
      </Text>

      <Section>Third-party services</Section>
      <Text>
        Your messages are sent to Anthropic&apos;s API using your own API key.
        Anthropic&apos;s use of that data is governed by their own privacy policy and
        terms of service. We encourage you to review Anthropic&apos;s policies
        separately. We have no control over how Anthropic processes data sent via
        their API.
      </Text>

      <Section>No server-side storage</Section>
      <Text>
        We do not operate any database. No messages, API keys, responses, or
        usage data are stored on our servers at any time. All processing happens
        in real time and nothing is persisted after the response is delivered to
        your browser.
      </Text>

      <Section>Local storage</Section>
      <Text>
        The only data stored on your device is an encrypted version of your API
        key in your browser&apos;s local storage. You can remove this at any time by
        clearing your browser data. No other information is stored locally.
      </Text>

      <Section>Children</Section>
      <Text>
        LoveReply is not intended for use by anyone under the age of 18. We do
        not knowingly collect data from minors.
      </Text>

      <Section>Changes to this policy</Section>
      <Text>
        We may update this policy from time to time. Any changes will be
        reflected on this page with an updated date. Continued use of the
        service constitutes acceptance of the updated policy.
      </Text>

      <Section>Contact</Section>
      <Text>
        If you have questions about this policy, please contact us at
        privacy@lovereply.ai.
      </Text>
    </Container>
  );
}
