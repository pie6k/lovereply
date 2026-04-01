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

const ShareLink = styled.a`
  font-size: 12px;
  color: #e8a0a0;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #f0baba;
  }
`;

export function Footer() {
  return (
    <FooterBar>
      <ShareLink href="/share">Share with your partner</ShareLink>
      <FooterLink href="/privacy">Privacy Policy</FooterLink>
      <FooterLink href="/terms">Terms of Service</FooterLink>
    </FooterBar>
  );
}
