import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Search,
  Bell,
  Menu,
  X,
  UploadCloud,
  CheckCircle2,
  Layers,
  BookOpen,
  GitCompare,
  GitBranch,
  FileText,
  History,
  Settings as SettingsIcon,
  Palette,
  Check,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { isMockApiEnabled } from '../../services/apiClient';

export default function CommandNavbar({ onOpenSearch }) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mockMode, setMockMode] = useState(() => isMockApiEnabled());
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const readDemoProfile = () => {
    try {
      return JSON.parse(localStorage.getItem('niyantran_demo_profile') || '{}');
    } catch {
      return {};
    }
  };
  const [demoProfile, setDemoProfile] = useState(readDemoProfile);
  const profileName = demoProfile.officerName || 'Demo Reviewer';
  const profileRole = demoProfile.officerRole || 'Prototype Reviewer';
  const profileRegion = demoProfile.officerRegion || 'Demo Region — not an official office';
  const profileInitials = profileName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'DR';
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    setActiveDropdown(null);
    setProfileOpen(false);
    setNotificationsOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const syncMode = () => setMockMode(isMockApiEnabled());
    const syncProfile = () => setDemoProfile(readDemoProfile());
    window.addEventListener('niyantran:api-config-changed', syncMode);
    window.addEventListener('niyantran:profile-updated', syncProfile);
    window.addEventListener('storage', syncProfile);
    return () => {
      window.removeEventListener('niyantran:api-config-changed', syncMode);
      window.removeEventListener('niyantran:profile-updated', syncProfile);
      window.removeEventListener('storage', syncProfile);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
    setNotificationsOpen(false);
    setProfileOpen(false);
  };

  const isRouteActive = (paths) => {
    return paths.some((p) => location.pathname === p || (p !== '/dashboard' && location.pathname.startsWith(p)));
  };

  return (
    <>
      {/* Top Command Bar: 100% Solid Opaque Background */}
      <header 
        className="sticky top-0 z-[100] w-full h-16 border-b border-[var(--border)] shadow-sm bg-[var(--surface)]"
      >
        <div className="max-w-[1560px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Wordmark */}
          <div className="flex items-center gap-8 shrink-0">
            <Link to="/dashboard" className="focus:outline-none flex items-center gap-2 group">
              <BrandLogo size="md" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium" ref={dropdownRef}>
              {/* Overview / Dashboard */}
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-accent/15 text-accent font-semibold border border-accent/30 shadow-sm'
                      : 'text-text-muted hover:text-text-primary hover:bg-[var(--surface-hover)]'
                  }`
                }
              >
                Dashboard
              </NavLink>

              {/* Applications */}
              <NavLink
                to="/applications"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-accent/15 text-accent font-semibold border border-accent/30 shadow-sm'
                      : 'text-text-muted hover:text-text-primary hover:bg-[var(--surface-hover)]'
                  }`
                }
              >
                Applications
              </NavLink>

              {/* Verification Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown('verification')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    isRouteActive(['/upload', '/validation', '/evidence', '/extraction'])
                      ? 'bg-accent/15 text-accent font-semibold border border-accent/30 shadow-sm'
                      : 'text-text-muted hover:text-text-primary hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <span>Verification</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'verification' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'verification' && (
                  <div 
                    className="dropdown-menu absolute left-0 mt-2 w-72 p-2 shadow-2xl"
                    style={{ backgroundColor: 'var(--surface-elevated)', opacity: 1, zIndex: 1000 }}
                  >
                    <Link
                      to="/upload"
                      className="dropdown-item flex items-start gap-3 p-2.5 hover:bg-[var(--surface-hover)] group"
                    >
                      <UploadCloud className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">
                          Document Ingestion
                        </div>
                        <div className="text-[11px] text-text-muted">Multi-PDF upload &amp; OCR extraction</div>
                      </div>
                    </Link>

                    <Link
                      to="/validation"
                      className="dropdown-item flex items-start gap-3 p-2.5 hover:bg-[var(--surface-hover)] group"
                    >
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--status-success)' }} />
                      <div>
                        <div className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">
                          Compliance Validation
                        </div>
                        <div className="text-[11px] text-text-muted">Configured demo rule checks</div>
                      </div>
                    </Link>

                    <Link
                      to="/applications/APP-2026-003/evidence"
                      className="dropdown-item flex items-start gap-3 p-2.5 hover:bg-[var(--surface-hover)] group"
                    >
                      <Layers className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--status-warning)' }} />
                      <div>
                        <div className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">
                          Evidence Explorer
                        </div>
                        <div className="text-[11px] text-text-muted">Evidence references and field comparisons</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Rules and Replay Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown('regutrace')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    isRouteActive(['/rules', '/replay'])
                      ? 'bg-accent/15 text-accent font-semibold border border-accent/30 shadow-sm'
                      : 'text-text-muted hover:text-text-primary hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <span className="font-semibold text-accent">Niyantran Tools</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'regutrace' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'regutrace' && (
                  <div 
                    className="dropdown-menu absolute left-0 mt-2 w-72 p-2 shadow-2xl"
                    style={{ backgroundColor: 'var(--surface-elevated)', opacity: 1, zIndex: 1000 }}
                  >
                    <Link
                      to="/rules"
                      className="dropdown-item flex items-start gap-3 p-2.5 hover:bg-[var(--surface-hover)] group"
                    >
                      <BookOpen className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">
                          Regulatory Rules
                        </div>
                        <div className="text-[11px] text-text-muted">Configured rules and source references</div>
                      </div>
                    </Link>

                    <Link
                      to="/rules/DEMO-CAPACITY-002/versions"
                      className="dropdown-item flex items-start gap-3 p-2.5 hover:bg-[var(--surface-hover)] group"
                    >
                      <GitCompare className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-text-primary group-hover:text-text-primary transition-colors">
                          Rule Versions &amp; Diffs
                        </div>
                        <div className="text-[11px] text-text-muted">Side-by-side threshold revisions</div>
                      </div>
                    </Link>

                    <Link
                      to="/replay"
                      className="dropdown-item flex items-start gap-3 p-2.5 hover:bg-[var(--surface-hover)] group"
                    >
                      <GitBranch className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--status-success)' }} />
                      <div>
                        <div className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">
                          Change Replay Engine
                        </div>
                        <div className="text-[11px] text-text-muted">Compare sample results across rule versions</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Review Queue */}
              <NavLink
                to="/review"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-accent/15 text-accent font-semibold border border-accent/30 shadow-sm'
                      : 'text-text-muted hover:text-text-primary hover:bg-[var(--surface-hover)]'
                  }`
                }
              >
                Review Desk
              </NavLink>

              {/* More Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown('more')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    isRouteActive(['/reports', '/audit', '/settings'])
                      ? 'bg-accent/15 text-accent font-semibold border border-accent/30 shadow-sm'
                      : 'text-text-muted hover:text-text-primary hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'more' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'more' && (
                  <div 
                    className="dropdown-menu absolute right-0 mt-2 w-56 p-2 shadow-2xl"
                    style={{ backgroundColor: 'var(--surface-elevated)', opacity: 1, zIndex: 1000 }}
                  >
                    <Link
                      to="/reports"
                      className="dropdown-item flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-primary hover:bg-[var(--surface-hover)]"
                    >
                      <FileText className="w-4 h-4 text-text-muted" />
                      <span>Compliance Reports</span>
                    </Link>

                    <Link
                      to="/audit"
                      className="dropdown-item flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-primary hover:bg-[var(--surface-hover)]"
                    >
                      <History className="w-4 h-4 text-text-muted" />
                      <span>Audit Trail</span>
                    </Link>

                    <div className="my-1 border-t border-[var(--border)]/60" />

                    <Link
                      to="/settings"
                      className="dropdown-item flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-primary hover:bg-[var(--surface-hover)]"
                    >
                      <SettingsIcon className="w-4 h-4 text-text-muted" />
                      <span>Platform Settings</span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right: Search, Notifications, Officer Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Search Shortcut */}
            <button
              onClick={() => onOpenSearch && onOpenSearch()}
              className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] text-xs text-text-muted hover:text-text-primary hover:border-accent/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            >
              <Search className="w-3.5 h-3.5 text-text-muted" />
              <span>Quick search...</span>
              <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[10px] font-mono text-text-secondary">
                ⌘K
              </kbd>
            </button>

            {/* Notification Bell with Solid Popover */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setActiveDropdown(null);
                  setProfileOpen(false);
                }}
                className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-[var(--surface-hover)] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                title="Regulatory alerts"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-[var(--surface)]" style={{ backgroundColor: 'var(--status-error)' }} />
              </button>

              {notificationsOpen && (
                <div 
                  className="dropdown-menu absolute right-0 mt-2 w-80 p-3 shadow-2xl"
                  style={{ backgroundColor: 'var(--surface-elevated)', opacity: 1, zIndex: 1000 }}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]/60">
                    <span className="text-xs font-semibold text-text-primary">Regulatory Alerts (3)</span>
                    <Link to="/review" className="text-[11px] text-accent hover:underline font-medium">
                      View All Desk
                    </Link>
                  </div>

                  <div className="py-2 space-y-2 text-xs">
                    <Link 
                      to="/applications/APP-2026-003/evidence"
                      className="block p-2 rounded-lg bg-[var(--background)] hover:bg-[var(--surface-hover)] border border-[var(--border)]/60 transition-colors"
                    >
                      <div className="flex items-center justify-between font-semibold" style={{ color: 'var(--status-error)' }}>
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3 h-3" style={{ color: 'var(--status-error)' }} />
                          Code Mismatch
                        </span>
                        <span className="text-[10px] font-mono text-text-muted">APP-2026-003</span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-1 leading-snug">
                        INST-1042 on Form vs INST-1024 on Registration Certificate.
                      </p>
                    </Link>

                    <Link 
                      to="/review"
                      className="block p-2 rounded-lg bg-[var(--background)] hover:bg-[var(--surface-hover)] border border-[var(--border)]/60 transition-colors"
                    >
                      <div className="flex items-center justify-between font-semibold" style={{ color: 'var(--status-warning)' }}>
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3 h-3" style={{ color: 'var(--status-warning)' }} />
                          Chronology Error
                        </span>
                        <span className="text-[10px] font-mono text-text-muted">APP-2026-004</span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-1 leading-snug">
                        Society registration date (2018) succeeds land deed date (2014).
                      </p>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Reviewer Profile & Theme Menu */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setActiveDropdown(null);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2.5 pl-2.5 border-l border-[var(--border)]/60 focus:outline-none group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center font-semibold text-xs text-accent group-hover:border-accent/60 transition-colors">
                  {profileInitials}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-semibold text-text-primary leading-tight">{profileName}</span>
                  <span className="text-[11px] text-text-muted leading-tight">{profileRole}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div 
                  className="dropdown-menu absolute right-0 mt-2 w-64 p-3 shadow-2xl space-y-3"
                  style={{ backgroundColor: 'var(--surface-elevated)', opacity: 1, zIndex: 1000 }}
                >
                  <div className="pb-2 border-b border-[var(--border)]/60">
                    <div className="font-semibold text-xs text-text-primary">{profileName}</div>
                    <div className="text-[11px] text-text-muted">{profileRole}</div>
                    <div className="text-[10px] font-mono text-accent mt-0.5">{profileRegion}</div>
                  </div>

                  {/* Theme Selector directly in profile menu */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-medium text-text-muted flex items-center gap-1.5">
                      <Palette className="w-3 h-3 text-accent" />
                      Visual Theme Preset
                    </span>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setTheme(THEMES.EXPERIMENTAL)}
                        className={`p-2 rounded-lg text-left text-xs border transition-all cursor-pointer ${
                          theme === THEMES.EXPERIMENTAL
                            ? 'bg-accent/15 border-accent text-accent font-semibold'
                            : 'bg-[var(--background)] border-[var(--border)] text-text-secondary hover:bg-[var(--surface-hover)]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px]">Light Neutral</span>
                          {theme === THEMES.EXPERIMENTAL && <Check className="w-3 h-3 text-accent" />}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#F5F7FB] border border-[var(--border)]" />
                          <span className="w-2 h-2 rounded-full bg-[#FFFFFF] border border-[var(--border)]" />
                          <span className="w-2 h-2 rounded-full bg-[#2457C5]" />
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTheme(THEMES.OBSIDIAN)}
                        className={`p-2 rounded-lg text-left text-xs border transition-all cursor-pointer ${
                          theme === THEMES.OBSIDIAN
                            ? 'bg-accent/15 border-accent text-accent font-semibold'
                            : 'bg-[var(--background)] border-[var(--border)] text-text-secondary hover:bg-[var(--surface-hover)]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px]">Obsidian Dark</span>
                          {theme === THEMES.OBSIDIAN && <Check className="w-3 h-3 text-accent" />}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#090D14] border border-[#3E4F69]" />
                          <span className="w-2 h-2 rounded-full bg-[#131A26]" />
                          <span className="w-2 h-2 rounded-full bg-[#5B8CFF]" />
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border)]/60 space-y-1">
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      <SettingsIcon className="w-3.5 h-3.5 text-text-muted" />
                      <span>Platform Settings</span>
                    </Link>
                    <Link
                      to="/audit"
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      <History className="w-3.5 h-3.5 text-text-muted" />
                      <span>Audit Ledger</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-[var(--surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer: Solid Opaque Background */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden border-b border-[var(--border)] px-4 py-4 space-y-3 shadow-2xl bg-[var(--surface-elevated)]"
            style={{ opacity: 1, zIndex: 1000 }}
          >
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link to="/dashboard" className="p-2.5 rounded-lg bg-[var(--surface-secondary)] text-text-primary font-medium hover:bg-[var(--surface-hover)]">
                Dashboard
              </Link>
              <Link to="/applications" className="p-2.5 rounded-lg bg-[var(--surface-secondary)] text-text-primary font-medium hover:bg-[var(--surface-hover)]">
                Applications
              </Link>
              <Link to="/upload" className="p-2.5 rounded-lg bg-[var(--surface-secondary)] text-text-primary font-medium hover:bg-[var(--surface-hover)]">
                Upload Docs
              </Link>
              <Link to="/validation" className="p-2.5 rounded-lg bg-[var(--surface-secondary)] text-text-primary font-medium hover:bg-[var(--surface-hover)]">
                Validation
              </Link>
              <Link to="/rules" className="p-2.5 rounded-lg bg-[var(--surface-secondary)] text-text-primary font-medium hover:bg-[var(--surface-hover)]">
                Rules
              </Link>
              <Link to="/replay" className="p-2.5 rounded-lg bg-[var(--surface-secondary)] text-text-primary font-medium hover:bg-[var(--surface-hover)]">
                Replay Engine
              </Link>
              <Link to="/review" className="p-2.5 rounded-lg bg-[var(--surface-secondary)] text-text-primary font-medium hover:bg-[var(--surface-hover)]">
                Review Desk
              </Link>
              <Link to="/reports" className="p-2.5 rounded-lg bg-[var(--surface-secondary)] text-text-primary font-medium hover:bg-[var(--surface-hover)]">
                Reports
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
