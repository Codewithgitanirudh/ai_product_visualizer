import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-base-100 rounded-lg shadow-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-brand-primary/10 rounded-lg">
            <MessageSquare className="w-6 h-6 text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold text-content-100">Chat With AI</h1>
        </div>
        <p className="text-content-200 text-lg">
          AI chat feature coming soon...
        </p>
      </div>
    </div>
  );
};

