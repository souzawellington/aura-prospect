import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AURA-PROSPECT',
  description:
    'Prospective reasoning agent. Tri-world model, active inference, PROACT lookahead, conjunctive stop gates.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
