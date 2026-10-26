import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FileSpreadsheet, ShieldCheck, CheckCircle2, AlertTriangle, 
  ArrowRight, Search, Filter, Sparkles, Eye, FileText, Check, 
  ChevronRight, RefreshCw, Layers
} from 'lucide-react';
import { extractionService } from '../services/extractionService';
import { applicationService } from '../services/applicationService';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { extractionStatusLabel } from '../utils/displayLabels';

export default function ExtractionResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(id || 'APP-2026-003');
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Load applications
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await applicationService.getApplications();
        setApplications(res.data || []);
      } catch (err) {
        console.error('Error fetching applications:', err);
      }
    };
    fetchApps();
  }, []);

  // Load extracted fields
  const fetchFields = async () => {
    try {
      setLoading(true);
      const res = await extractionService.getExtractedFields(selectedAppId);
      setFields(res.data || []);
    } catch (err) {
      console.error('Error fetching extracted fields:', err);
      addToast('Failed to load extracted fields.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, [selectedAppId]);

  const handleConfirmField = async (fieldId) => {
    try {
      await extractionService.confirmField(selectedAppId, fieldId);
      addToast('Field review saved in the current demo session.', 'success');
      fetchFields();
    } catch (err) {
      console.error('Confirm field error:', err);
      addToast('Error confirming field.', 'error');
    }
  };

  const handleTriggerReExtraction = async () => {
    try {
      setIsExtracting(true);
      await extractionService.triggerExtraction(selectedAppId);
      addToast('Demo extraction results refreshed. Live PyMuPDF/Tesseract processing requires the connected backend.', 'success');
      fetchFields();
    } catch (err) {
      console.error('Extraction trigger error:', err);
      addToast('Error executing extraction.', 'error');
    } finally {
      setIsExtracting(false);
    }
  };

  const filteredFields = fields.filter((f) => {
    if (filterStatus !== 'All' && f.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        f.fieldName.toLowerCase().includes(q) ||
        String(f.extractedValue).toLowerCase().includes(q) ||
        f.sourceDocument.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero */}
      <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-accent/15 text-accent border border-accent/25 flex items-center gap-1.5 font-semibold">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                PDF Text & OCR Extraction (Demo)
              </span>
              <span className="text-xs text-text-muted font-mono">Synthetic field extraction results</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary tracking-tight">
              Extracted Statutory Entities
            </h1>
            <p className="text-sm text-text-secondary mt-1.5 max-w-2xl leading-relaxed">
              Example field values and source references for the current demo dataset. Actual PyMuPDF/Tesseract processing requires the connected backend.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              isLoading={isExtracting}
              onClick={handleTriggerReExtraction}
            >
              Re-Run Extraction
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={ShieldCheck}
              onClick={() => navigate('/validation')}
            >
              Execute Validation
            </Button>
          </div>
        </div>

        {/* Application Selector */}
        <div className="pt-6 mt-6 border-t border-border/70 flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider shrink-0">
            Current Application:
          </label>
          <select
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-surface-elevated border border-border text-text-primary font-mono focus:outline-none focus:border-accent"
            style={{ backgroundColor: 'var(--input-background)', color: 'var(--text-primary)' }}
          >
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.id} — {app.institutionName} ({app.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search field name, extracted text, or document..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            style={{ backgroundColor: 'var(--input-background)', color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg bg-surface border border-border text-text-primary focus:outline-none focus:border-accent"
            style={{ backgroundColor: 'var(--input-background)', color: 'var(--text-primary)' }}
          >
            <option value="All">All Verification Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Conflicting">Conflicting Discrepancy</option>
          </select>
        </div>
      </div>

      {/* Entities Table */}
      {loading ? (
        <div className="bg-surface rounded-xl p-8 border border-border space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : filteredFields.length === 0 ? (
        <EmptyState
          icon={FileSpreadsheet}
          title="No extracted entities found"
          description="Either no documents have been processed for this application, or your search filter yielded 0 results."
          action={{
            label: "Trigger Extraction",
            onClick: handleTriggerReExtraction
          }}
        />
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-elevated text-text-muted font-mono uppercase text-[11px] border-b border-border">
                  <th className="py-3 px-4">Field Name</th>
                  <th className="py-3 px-4">Extracted Value</th>
                  <th className="py-3 px-4">Source Document</th>
                  <th className="py-3 px-4">Method / Engine</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredFields.map((f) => {
                  const isConflict = f.status === 'Conflicting';
                  return (
                    <tr 
                      key={f.id}
                      className={`hover:bg-surface-elevated/40 transition-colors ${
                        isConflict ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-semibold text-text-primary">
                        {f.fieldName}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-accent">
                        {f.extractedValue}
                      </td>
                      <td className="py-3 px-4 text-text-secondary">
                        <span className="block truncate max-w-xs">{f.sourceDocument}</span>
                        <span className="text-[10px] text-text-muted font-mono">Page {f.pageNumber}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-text-muted">
                        {f.extractionMethod || 'PDF/OCR demo fixture'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        <span 
                          style={{
                            color: f.confidence >= 0.95 
                              ? 'var(--status-success)' 
                              : f.confidence >= 0.85 
                              ? 'var(--accent)' 
                              : 'var(--status-pending)'
                          }}
                        >
                          {(f.confidence * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={isConflict ? 'warning' : 'success'}>
                          {f.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {f.isConfirmed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: 'var(--status-success)' }}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmed (demo)
                          </span>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[11px] py-1"
                            onClick={() => handleConfirmField(f.id)}
                          >
                            Confirm
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="px-4 py-3 border-t border-border text-[11px] text-text-muted">* Sample scores come from synthetic demo fixtures; they are not measured OCR confidence or proof of accuracy.</p>
        </div>
      )}
    </div>
  );
}
