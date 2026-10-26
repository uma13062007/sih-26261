import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import CommandNavbar from './CommandNavbar';
import GlobalSearchModal from '../common/GlobalSearchModal';

export default function AppLayout() {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans selection:bg-accent selection:text-background transition-colors duration-200">
      {/* Slim Command-Center Top Navigation */}
      <CommandNavbar onOpenSearch={() => setSearchModalOpen(true)} />

      {/* Global Command Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <Outlet />
      </main>

      {/* Discreet Dark Enterprise Footer */}
      <footer className="border-t border-border/60 bg-surface/80 text-text-muted text-xs py-5 px-4 sm:px-6 backdrop-blur-sm">
        <div className="max-w-[1560px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary tracking-wide">NIYANTRAN</span>
            <span className="opacity-40">&bull;</span>
            <span className="text-text-muted">Every Decision. Backed by Evidence.</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans">
            <span className="text-text-secondary flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-status-warning" />
              Synthetic demo • Not an official AICTE platform
            </span>
            <span className="opacity-40">&bull;</span>
            <Link to="/settings" className="hover:text-text-primary transition-colors">
              Platform Settings
            </Link>
            <span className="opacity-40">&bull;</span>
            <Link to="/audit" className="hover:text-text-primary transition-colors">
              Audit History
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
