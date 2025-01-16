/** @format */
"use client";
import ConnectWallet from "@/components/connectWallet";
import { useAppKit } from "@/config/config";

export default function App() {
  useAppKit();
  return <ConnectWallet />;
}
