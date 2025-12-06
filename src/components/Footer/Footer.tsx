import type { HTMLAttributes, ReactNode } from "react";

interface FooterProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export const Footer = ({ className, children, onClick }: FooterProps) => {
  const words = String(children).split(" ");
  const word1 = words.slice(0, -1).join(" ");
  const word2 = " " + words[words.length - 1];

  return (
    <footer className={className}>
      <span>{word1}</span>
      <span onClick={onClick}>{word2}</span>
    </footer>
  );
};
