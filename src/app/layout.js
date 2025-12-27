import "./globals.css";
import VerticalNavbar from "@/component/Navbar/navbar";
import Favicon from "/public/favicon.webp";

export const metadata = {
  title: "Kim",
  description: "Kim's blog",
  icons: [{ rel: "icon", url: Favicon.src }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <VerticalNavbar />
        <main style={{ marginLeft: "60px" }}>{children}</main>
      </body>
    </html>
  );
}
