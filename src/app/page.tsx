/** @format */
"use client";
import { MessageGrid } from "@/components/messages";
import Navbar from "@/components/navbar";
import Profile from "@/components/profile";
import { useAppKit } from "@/config/config";

const userFeedbacks = [
  {
    id: "1",
    author: "John Doe",
    content:
      "Great product! I love how easy it is to use. The interface is intuitive and I was able to get started right away without any hassle.",
    timestamp: "2 days ago",
  },
  {
    id: "2",
    author: "Jane Smith",
    content:
      "The customer support team was very helpful in resolving my issue. They responded quickly and provided clear instructions to fix the problem.",
    timestamp: "1 day ago",
  },
  {
    id: "3",
    author: "Mike Johnson",
    content:
      "I would appreciate if you could add more customization options. While the current features are good, having more control over the appearance would be great.",
    timestamp: "12 hours ago",
  },
  {
    id: "4",
    author: "Sarah Williams",
    content:
      "This app has significantly improved my productivity. The task management features are particularly useful for keeping track of my daily work.",
    timestamp: "3 hours ago",
  },
  {
    id: "5",
    author: "Chris Brown",
    content:
      "I encountered a bug when trying to export my data. The export process seems to freeze halfway through. Please look into this issue.",
    timestamp: "1 hour ago",
  },
  {
    id: "6",
    author: "Emily Davis",
    content:
      "The recent update has made the app much faster. I appreciate the performance improvements and how smooth everything runs now.",
    timestamp: "30 minutes ago",
  },
];

export default function App() {
  useAppKit();
  return (
    <>
      <Navbar />
      <Profile />
      <MessageGrid messages={userFeedbacks} />
    </>
  );
}
