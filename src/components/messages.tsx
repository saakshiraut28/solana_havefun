/** @format */

import React from "react";
import MessageCard from "./messageCard";

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  authorPublicKey: string;
}

interface MessageGridProps {
  messages: Message[];
}

export function MessageGrid({
  messages,
}: MessageGridProps): React.ReactElement {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  );
}

export type { Message }; // Export the Message type for reuse
