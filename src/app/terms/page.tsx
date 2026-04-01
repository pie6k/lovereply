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

export default function TermsPage() {
  return (
    <Container>
      <Title>Terms of Service</Title>
      <Text>
        LoveReply provides AI-generated suggestions for relationship
        communication. These suggestions are for informational purposes only and
        should not be considered professional advice.
      </Text>
      <Text>
        You are responsible for how you use the suggested replies. We are not
        liable for any outcomes resulting from the use of this service.
      </Text>
      <Text>
        We reserve the right to modify or discontinue the service at any time
        without notice.
      </Text>
    </Container>
  );
}
