/** @format */
"use client";
import Navbar from "@/components/navbar";
import Profile from "@/components/profile";
import { useAppKit } from "@/config/config";

export default function App() {
  useAppKit();
  return (
    <>
      <Navbar />
      <Profile />
    </>
  );
}
