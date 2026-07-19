import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HavenAI — AI-Powered Refugee Assistance',
  description:
    'Get immediate AI assistance in your language. HavenAI helps refugees find safety, resources, and guidance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F8F9FA] text-[#1A1A2E]">
        {children}
      </body>
    </html>
  );
}
