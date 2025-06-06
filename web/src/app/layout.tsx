import "./globals.css";
import { ClientProviders } from './client-providers';

export const metadata = {
  title: "URL Shortener",
  description: "Create short, memorable links in seconds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}