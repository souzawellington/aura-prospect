import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aura — Prospective Reasoning Agent',
  description:
    'Arquiteto Cognitivo com modelagem causal t+1..t+5, inferência ativa e portão de paragem conjuntivo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
