import { Providers } from '../components/providers';
import './globals.css';

export const metadata = {
  title: 'Remilia Social Credit System',
  description: 'The gatekeeping tool for remilia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
