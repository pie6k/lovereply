"use client";

import styled from "styled-components";

const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const Logo = styled.span`
  font-family: var(--font-instrument-serif), serif;
  font-size: 20px;
  color: #fff;
  letter-spacing: -0.02em;
`;

const CreditsLink = styled.a`
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: rgba(255, 255, 255, 0.7);
  }
`;

export function Header() {
  return (
    <HeaderBar>
      <Logo>lovereply</Logo>
      <CreditsLink href="#">Credits</CreditsLink>
    </HeaderBar>
  );
}
