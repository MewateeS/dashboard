import './globals.css';
import LayoutClient from './layout-client';

export const metadata = {
  title: 'Mission Control',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
