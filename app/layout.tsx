import type { Metadata } from "next";
import 'antd/dist/reset.css';
import "./globals.css";
import ReactQueryProvider from "./components/common/ReactQueryProvider";

import { ThemeProvider } from "./components/common/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider>
        <ReactQueryProvider>
          <body>
            {children}
          </body>
        </ReactQueryProvider>
      </ThemeProvider>
    </html>
  );
}
