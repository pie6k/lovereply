"use client";

import styled from "styled-components";

const FooterBar = styled.footer`
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: center;
  gap: 24px;
`;

const FooterLink = styled.a`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export function Footer() {
  return (
    <FooterBar>
      <FooterLink href="/privacy">Privacy Policy</FooterLink>
      <FooterLink href="/terms">Terms of Service</FooterLink>
    </FooterBar>
  );
}
