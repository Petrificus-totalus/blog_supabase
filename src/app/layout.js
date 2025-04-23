import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VerticalNavbar from "@/component/Navbar/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "My Blog",
  description: "My Blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <VerticalNavbar />
        <main style={{ marginLeft: "60px" }}>{children}</main>
      </body>
    </html>
  );
}
