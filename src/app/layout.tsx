import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { config } from "@/config";
import Web3ModalProvider from "@/context";
import { Toaster } from "react-hot-toast";

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TESTING SMART CONTRACT",
  description: "A frontend for the TodoList app with a smart contract backend",
  metadataBase: new URL("https://sc-connect-todolist-ui.netlify.app")
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Web3ModalProvider initialState={initialState}>
          <main>
            {children}
          </main>
          <Toaster position="top-center" />
        </Web3ModalProvider>
      </body>
    </html>
  );
}
