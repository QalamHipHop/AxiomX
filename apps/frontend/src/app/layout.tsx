import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AxiomX - Non-Custodial Crypto Super Aggregator',
  description: 'Mathematical Precision in Every Trade. Infinite Liquidity. Zero Custody.',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
