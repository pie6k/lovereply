"use client";

import styled from "styled-components";

const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 24px;
  gap: 20px;
`;

const HeaderLink = styled.a`
  color: rgba(255, 255, 255, 0.35);
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export function Header() {
  return (
    <HeaderBar>
      <HeaderLink href="https://github.com/pie6k/lovereply" target="_blank" rel="noopener">
        GitHub
      </HeaderLink>
      <HeaderLink href="https://x.com/pie6k" target="_blank" rel="noopener">
        Follow me
      </HeaderLink>
      <HeaderLink href="/why">Why use this?</HeaderLink>
    </HeaderBar>
  );
}
