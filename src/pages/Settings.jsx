import React, { useState } from 'react';
import { 
  Sliders, Server, Palette, User, ShieldCheck, RefreshCw, 
  CheckCircle2, AlertCircle, Sparkles, ExternalLink, Database, 
  Activity, Lock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { mockStore } from '../mocks/store';
import { getApiBaseUrl, isMockApiEnabled, setMockApiEnabled, setRuntimeApiBaseUrl } from '../services/apiClient';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ConfirmModal from '../components/common/ConfirmModal';

export default function Settings() {
  const { currentTheme, setTheme, themes } = useTheme();
  const { addToast } = useToast();

  const [apiUrl, setApiUrl] = useState(() => getApiBaseUrl());
  const [mockMode, setMockMode] = useState(() => isMockApiEnabled());
  const [pingStatus, setPingStatus] = useState(null);
  const [isPinging, setIsPinging] = useState(false);

  // Reviewer credentials state
  const [officerName, setOfficerName] = useState(() => { try { return JSON.parse(localStorage.getItem('niyantran_demo_profile') || '{}').officerName || 'Demo Compliance Reviewer'; } catch { return 'Demo Compliance Reviewer'; } });
  const [officerRole, setOfficerRole] = useState(() => { try { return JSON.parse(localStorage.getItem('niyantran_demo_profile') || '{}').officerRole || 'Prototype Reviewer'; } catch { return 'Prototype Reviewer'; } });
  const [officerRegion, setOfficerRegion] = useState(() => { try { return JSON.parse(localStorage.getItem('niyantran_demo_profile') || '{}').officerRegion || 'Demo Region — not an official office'; } catch { return 'Demo Region — not an official office'; } });
  const [certificateKey] = useState('DEMO-REVIEWER-01');

  // Reset modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleTestPing = async () => {
    setIsPinging(true);
    setPingStatus(null);
    try {
      if (mockMode) {
        setPingStatus({
          status: 'info',
          message: 'Mock mode is active. No live backend request was sent; actions use the synthetic demo store.',
        });
        addToast('Mock mode is active; live API health was not checked.', 'info');
        return;
      }

      const savedUrl = setRuntimeApiBaseUrl(apiUrl);
      const serverRoot = savedUrl.replace(/\/api(?:\/v\d+)?$/i, '').replace(/\/+$/, '');
      const response = await fetch(`${serverRoot}/health`, { method: 'GET' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setPingStatus({
        status: 'success',
        message: `FastAPI health endpoint responded successfully at ${serverRoot}/health.`,
      });
      addToast('FastAPI health check passed and the API URL was saved.', 'success');
    } catch (error) {
      setPingStatus({
        status: 'warning',
        message: `Backend health check failed. Verify the URL and ensure FastAPI is running. ${error.message || ''}`.trim(),
      });
      addToast('Backend health check failed. Mock mode remains available.', 'warning');
    } finally {
      setIsPinging(false);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('niyantran_demo_profile', JSON.stringify({ officerName, officerRole, officerRegion, savedAt: new Date().toISOString() }));
    window.dispatchEvent(new CustomEvent('niyantran:profile-updated'));
    addToast('Demo reviewer profile saved in this browser. No official credentials or digital certificate were created.', 'success');
  };

  const handleResetData = () => {
    mockStore.reset();
    setIsResetModalOpen(false);
    addToast('Synthetic demo session reset to its initial state. Refresh pages to see reset data.', 'success');
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Top Banner / Hero */}
      <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-accent/15 text-accent border border-accent/25 flex items-center gap-1.5 font-semibold">
                <Sliders className="w-3.5 h-3.5" />
                Platform Configuration
              </span>
              <span className="text-xs text-text-muted font-mono">Prototype Settings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary tracking-tight">
              Platform Settings & Gateway
            </h1>
            <p className="text-sm text-text-secondary mt-1.5 max-w-2xl leading-relaxed">
              Configure the demo/live API mode, theme, locally saved demo profile, and synthetic data reset. This prototype does not issue official credentials.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={() => setIsResetModalOpen(true)}
            className="text-rose-400 hover:text-rose-300 border-rose-500/30 shrink-0"
          >
            Reset Demo Database
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Backend Integration & API Gateway */}
        <div className="bg-surface rounded-xl p-6 border border-border space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-text-primary">
                Backend Service Architecture & API Gateway
              </h2>
            </div>
            <span className="text-xs font-mono text-text-muted">
              FastAPI / Mock Adapter
            </span>
          </div>

          <div className="space-y-4">
            {/* Mode Selector Toggle */}
            <div className="p-4 rounded-xl bg-surface-elevated/70 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-text-primary block">
                  Synthetic Mock Mode (Prototype)
                </span>
                <p className="text-xs text-text-muted leading-relaxed">
                  When enabled, frontend actions use synthetic in-memory demo records. Uploaded file contents are not sent to FastAPI, and extraction, registry checks, and rule outcomes are simulated.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-mono font-semibold ${mockMode ? 'text-accent' : 'text-text-muted'}`}>
                  {mockMode ? 'Synthetic Demo Mode' : 'Live API Mode'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = !mockMode;
                    setMockApiEnabled(next);
                    setMockMode(next);
                    setPingStatus(null);
                    addToast(next ? 'Mock mode enabled. Application actions will use synthetic data.' : 'Live API mode enabled. Ensure the FastAPI backend is running before using application pages.', 'info');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border ${
                    mockMode ? 'bg-accent border-accent' : 'bg-surface border-border'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-background transition-transform ${
                      mockMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Base URL & Health Check */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                  FastAPI Backend Base URL
                </label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  disabled={mockMode}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-border text-text-primary font-mono focus:outline-none focus:border-accent disabled:opacity-50"
                  style={{ backgroundColor: 'var(--input-background)', color: 'var(--text-primary)' }}
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <Button
                  variant="outline"
                  size="md"
                  icon={Activity}
                  isLoading={isPinging}
                  onClick={handleTestPing}
                  className="w-full"
                >
                  {mockMode ? 'Check Mock Mode' : 'Apply URL & Test'}
                </Button>
              </div>
            </div>

            {/* Ping Result Banner */}
            {pingStatus && (
              <div 
                className="p-3 rounded-lg border text-xs flex items-center gap-2.5"
                style={{
                  backgroundColor: pingStatus.status === 'success' ? 'rgba(34, 160, 100, 0.10)' : pingStatus.status === 'warning' ? 'rgba(180, 83, 9, 0.10)' : 'var(--surface-elevated)',
                  color: pingStatus.status === 'success' ? 'var(--status-success)' : pingStatus.status === 'warning' ? 'var(--status-warning)' : 'var(--text-secondary)',
                  borderColor: pingStatus.status === 'success' ? 'rgba(34, 160, 100, 0.25)' : pingStatus.status === 'warning' ? 'rgba(180, 83, 9, 0.25)' : 'var(--border)',
                }}
              >
                {pingStatus.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--status-success)' }} />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--status-pending)' }} />
                )}
                <span>{pingStatus.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Theme Engine & Appearance */}
        <div className="bg-surface rounded-xl p-6 border border-border space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-text-primary">
                Design System & Color Tokens
              </h2>
            </div>
            <span className="text-xs font-mono text-accent">
              Active: {currentTheme?.name || 'Earth Modern'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  addToast(`Theme switched to ${t.name}.`, 'info');
                }}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  currentTheme?.id === t.id
                    ? 'bg-accent/10 border-accent shadow-md'
                    : 'bg-surface-elevated/50 border-border hover:border-border/90'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-text-primary">{t.name}</span>
                  {currentTheme?.id === t.id && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent text-background font-bold">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">
                  {t.description}
                </p>
                {/* Palette preview swatches */}
                <div className="flex items-center gap-1.5">
                  {t.swatches?.map((color, idx) => (
                    <span
                      key={idx}
                      className="w-5 h-5 rounded-full border border-black/30"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reviewer Officer Credentials */}
        <div className="bg-surface rounded-xl p-6 border border-border space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-text-primary">
                Demo Reviewer Profile
              </h2>
            </div>
            <span className="text-xs font-mono text-text-muted">
              Statutory Signature
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Demo Reviewer Name
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-border text-text-primary focus:outline-none focus:border-accent"
                  style={{ backgroundColor: 'var(--input-background)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Demo Role Label
                </label>
                <input
                  type="text"
                  value={officerRole}
                  onChange={(e) => setOfficerRole(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-border text-text-primary focus:outline-none focus:border-accent"
                  style={{ backgroundColor: 'var(--input-background)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Demo Region Label
                </label>
                <input
                  type="text"
                  value={officerRegion}
                  onChange={(e) => setOfficerRegion(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-border text-text-primary focus:outline-none focus:border-accent"
                  style={{ backgroundColor: 'var(--input-background)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Demo Reference ID (not a certificate)
                </label>
                <input
                  type="text"
                  value={certificateKey}
                  readOnly
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface-elevated border border-border text-text-muted font-mono"
                  style={{ backgroundColor: 'var(--input-background)' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <Button type="submit" variant="primary" size="sm">
                Save Reviewer Credentials
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Demo Data */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetData}
        title="Reset Demonstration Database?"
        message="This will reset all synthetic applications, demo documents, findings, and rule-version history back to their default pristine hackathon showcase state."
        confirmText="Reset Database"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
