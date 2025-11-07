import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Randomizer',
  description: 'Generate random numbers, passwords, colors, UUIDs, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
