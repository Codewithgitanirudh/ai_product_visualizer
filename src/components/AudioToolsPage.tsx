
import { Music } from 'lucide-react';

export default function AudioToolsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-base-100 rounded-lg shadow-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-brand-primary/10 rounded-lg">
            <Music className="w-6 h-6 text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold text-content-100">Sound / Audio Tools</h1>
        </div>
        <p className="text-content-200 text-lg">
          Audio tools feature coming soon...
        </p>
      </div>
    </div>
  );
}

