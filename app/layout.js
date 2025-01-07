import { Libre_Baskerville } from "next/font/google";


import "./globals.css";
const lato = Libre_Baskerville({ subsets: ["latin"], weight: ["400"] });


export const metadata = {
  title: "DevLinks",
  description: "Link sharing app for developers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={lato.className}
      >
        {children}
      </body>
    </html>
  );
}
