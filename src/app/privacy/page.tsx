"use client";

import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 60px 24px;
`;

const Title = styled.h1`
  font-family: var(--font-instrument-serif), serif;
  font-size: 32px;
  font-weight: 400;
  margin-bottom: 32px;
`;

const Text = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 16px;
`;

export default function PrivacyPage() {
  return (
    <Container>
      <Title>Privacy Policy</Title>
      <Text>
        LoveReply does not store any messages you submit. Your messages are sent
        to our AI provider for analysis and are not retained after the response
        is generated.
      </Text>
      <Text>
        We do not use cookies for tracking. We do not sell or share any personal
        data.
      </Text>
      <Text>
        If you have questions about this policy, please contact us at
        privacy@lovereply.ai.
      </Text>
    </Container>
  );
}
