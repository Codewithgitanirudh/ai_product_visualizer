import { Link } from 'react-router';

export function Header () {
  return (
    <header className="md:border-b md:border-base-400 d:shadow-sm sticky top-0 z-40 md:backdrop-blur-sm md:bg-white/95 md:pl-0 pl-12">
      <div className="container mx-auto px-4 md:px-8 md:py-5 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="p-2.5 bg-linear-to-br from-brand-primary via-brand-secondary to-brand-accent rounded-xl shadow-md">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-content-100 tracking-tight">Omnexia AI</h1>
            <p className="text-xs text-content-300 font-medium tracking-tight mt-1 md:block hidden">Transform products with AI-powered visualizations</p>
          </div>
        </Link>
      </div>
    </header>
  );
};
