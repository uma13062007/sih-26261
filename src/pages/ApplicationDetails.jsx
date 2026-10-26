import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Layers,
  FileText,
  Clock,
  ShieldCheck,
  Shield,
  GitBranch,
  Hash,
  Eye,
  CheckSquare,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  RefreshCw
} from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { applicationStatusLabel, extractionStatusLabel } from '../utils/displayLabels';
import { documentService } from '../services/documentService';
import { extractionService } from '../services/extractionService';
import { validationService } from '../services/validationService';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import Tabs from '../components/common/Tabs';
import Modal from '../components/common/Modal';
import { REQUIREMENT_MAP } from '../mocks/requirementMap';

// ─── Authenticity Inspector Tab ───────────────────────────────────────────────
function AuthenticityTab({ app, documents }) {
  const [manualVerified, setManualVerified] = useState({});
  const [reviewingDocumentId, setReviewingDocumentId] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const recorded = {};
    documents.forEach((doc) => {
      if (doc.manualVerification?.status === 'manual_review_recorded') recorded[doc.id] = true;
    });
    setManualVerified(recorded);
  }, [documents]);

  const handleMarkVerified = async (docId) => {
    try {
      setReviewingDocumentId(docId);
      await documentService.markManuallyReviewed(app.id, docId);
      setManualVerified((prev) => ({ ...prev, [docId]: true }));
      addToast({ title: 'Manual Review Recorded', message: `A manual review event was saved for ${docId}. This does not verify authenticity.`, type: 'success' });
    } catch (error) {
      addToast({ title: 'Could not record review', message: error.message || 'The review event could not be saved.', type: 'error' });
    } finally {
      setReviewingDocumentId(null);
    }
  };

  // Seeded authenticity signals per document
  const getSignals = (doc) => {
    const seed = doc.id.charCodeAt(doc.id.length - 1);
    return {
      demoReference: `DEMO-DOC-${doc.id}`,
      duplicate: seed % 3 === 0 ? 'Illustrative duplicate flag in this demo fixture' : 'No duplicate flag in this demo fixture',
      duplicateType: seed % 3 === 0 ? 'warning' : 'success',
      creationDate: '2026-10-18',
      author: 'Synthetic fixture — not verified',
      lastModified: '2026-10-20T08:43:11Z',
      digitalSignature: seed % 4 === 0 ? 'Present – Signature state SIMULATED' : 'Not present',
      signatureType: seed % 4 === 0 ? 'info' : 'neutral',
      issuerRegistry: 'Demo status only — no official registry was contacted',
    };
  };

  return (
    <div className="space-y-4">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--status-pending)]/10 border border-[var(--status-pending)]/30">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--status-pending)' }} />
        <p className="text-xs text-text-secondary leading-relaxed">
          <strong style={{ color: 'var(--status-pending)' }}>Authenticity Inspector Disclaimer:</strong> Authenticity signals are review flags to guide officer attention. 
          A valid digital signature does not validate factual claims. No official registry verification is performed in this prototype. 
          All signals are SIMULATED for demonstration purposes.
        </p>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => {
          const signals = getSignals(doc);
          const isVerified = manualVerified[doc.id];
          return (
            <div key={doc.id} className="bg-surface rounded-xl border border-border overflow-hidden">
              {/* Doc Header */}
              <div className="px-4 py-3 bg-surface-elevated/40 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-text-primary">{doc.name}</div>
                    <div className="text-[10px] font-mono text-text-muted">{doc.category} • {doc.size}</div>
                  </div>
                </div>
                {isVerified ? (
                  <Badge variant="success" size="sm" dot>Manual review recorded</Badge>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleMarkVerified(doc.id)}
                    disabled={reviewingDocumentId === doc.id}
                    className="text-[11px] px-3 py-1.5 rounded-lg border border-border bg-surface-hover text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors font-medium disabled:opacity-60"
                  >
                    {reviewingDocumentId === doc.id ? 'Saving…' : 'Record manual review'}
                  </button>
                )}
              </div>

              {/* Signal Grid */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                {/* SHA-256 Hash */}
                <div className="p-2.5 rounded-lg bg-surface-elevated/30 border border-border space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-text-muted uppercase">
                    <Hash className="w-3 h-3" /> Demo document reference
                  </div>
                  <div className="font-mono text-[10px] text-accent break-all leading-tight">{signals.demoReference}</div>
                  <div className="text-[10px] text-text-muted italic">Illustrative ID only; no cryptographic hash was computed.</div>
                </div>

                {/* Duplicate Signal */}
                <div className="p-2.5 rounded-lg bg-surface-elevated/30 border border-border space-y-1">
                  <div className="text-[10px] font-mono font-semibold text-text-muted uppercase">Duplicate Signal</div>
                  <div 
                    className="text-[11px] font-medium"
                    style={{ color: signals.duplicateType === 'warning' ? 'var(--status-pending)' : 'var(--status-success)' }}
                  >
                    {signals.duplicate}
                  </div>
                </div>

                {/* Metadata Observations */}
                <div className="p-2.5 rounded-lg bg-surface-elevated/30 border border-border space-y-1">
                  <div className="text-[10px] font-mono font-semibold text-text-muted uppercase">Metadata Observations</div>
                  <div className="space-y-0.5 text-[10px]">
                    <div className="flex justify-between"><span className="text-text-muted">Created:</span><span className="text-text-secondary font-mono">{signals.creationDate}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Author:</span><span className="text-text-secondary">{signals.author}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Last Modified:</span><span className="text-text-secondary font-mono">{signals.lastModified}</span></div>
                  </div>
                  <div className="text-[9px] text-text-muted italic">Review flags, not proof of forgery</div>
                </div>

                {/* Digital Signature */}
                <div className="p-2.5 rounded-lg bg-surface-elevated/30 border border-border space-y-1">
                  <div className="text-[10px] font-mono font-semibold text-text-muted uppercase">Digital Signature</div>
                  <Badge variant={signals.signatureType} size="sm">{signals.digitalSignature}</Badge>
                  <div className="text-[10px] font-mono text-text-muted uppercase mt-1">Issuer/Registry Check</div>
                  <div className="text-[10px] text-text-muted italic">{signals.issuerRegistry}</div>
                </div>
              </div>

              {/* Manual Verification Status */}
              <div className="px-4 py-2.5 border-t border-border bg-surface-elevated/20 flex items-center gap-2 text-[11px]">
                {isVerified ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5" style={{ color: 'var(--status-success)' }} />
                    <span style={{ color: 'var(--status-success)' }}>Manual review event recorded</span>
                  </>
                ) : (
                  <><Eye className="w-3.5 h-3.5 text-text-muted" /><span className="text-text-muted">Pending officer review</span></>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Evidence Passport Tab ─────────────────────────────────────────────────────
function EvidencePassportTab({ app, documents, findings }) {
  // Seeded timeline events
  const timelineEvents = [
    {
      type: 'submission',
      icon: UploadCloud,
      color: 'text-accent',
      title: 'Document Package Submitted',
      detail: `${documents.length} documents uploaded by institutional admin`,
      timestamp: app?.submittedAt || '2026-10-21T15:45:00Z',
      meta: documents.map((d) => d.name).join(', '),
    },
    {
      type: 'ocr',
      icon: Sparkles,
      color: 'text-accent',
      title: 'OCR / Extraction Run Completed',
      detail: `Synthetic extraction timeline entry; live OCR is not connected in this frontend demo.`,
      timestamp: '2026-10-21T16:00:00Z',
      meta: 'Synthetic sample metrics; extraction performance has not been measured.',
    },
    {
      type: 'rule',
      icon: BookShelf,
      color: 'text-accent',
      title: 'Rule Version Applied',
      detail: 'Configured demonstration ruleset loaded',
      timestamp: '2026-10-21T16:01:00Z',
      meta: 'Configured demo rules only',
    },
    ...findings.map((f) => ({
      type: 'finding',
      icon: AlertTriangle,
      color: f.severity === 'high' ? 'text-[var(--status-error)]' : 'text-[var(--status-warning)]',
      title: `Finding Raised: ${f.title}`,
      detail: `${f.ruleId} — ${f.summary || f.explanation}`,
      timestamp: f.createdAt,
      meta: `Severity: ${f.severity} • Status: ${f.status}`,
    })),
    {
      type: 'authenticity',
      icon: Shield,
      color: 'text-[var(--status-success)]',
      title: 'Authenticity Signals Computed',
      detail: 'Synthetic metadata indicators displayed; no cryptographic hash computed',
      timestamp: '2026-10-23T10:00:00Z',
      meta: 'SIMULATED — No duplicate detected in session',
    },
    ...(findings.filter((f) => f.reviewerDecision).map((f) => ({
      type: 'review',
      icon: CheckSquare,
      color: 'text-[var(--status-success)]',
      title: `Officer Decision: ${f.reviewerDecision}`,
      detail: `Finding ${f.id} — ${f.reviewerNotes || 'No notes provided'}`,
      timestamp: f.reviewedAt || '2026-10-24T10:00:00Z',
      meta: `Reviewed by: ${f.reviewedBy || 'Demo Reviewer'}`,
    }))),
    {
      type: 'replay',
      icon: GitBranch,
      color: 'text-accent',
      title: 'Synthetic Regulatory Change Replay Executed',
      detail: 'DEMO-CAPACITY-002: v1.0 (30 seats) → v2.0 (60 seats)',
      timestamp: '2026-10-24T12:00:00Z',
      meta: 'Demo threshold change — Not an official AICTE regulation',
    },
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="space-y-4">
      {/* SYNTHETIC DEMO disclaimer */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-accent/5 border border-accent/20">
        <Info className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-muted leading-relaxed">
          <strong className="text-accent">SYNTHETIC DEMO</strong> — This timeline is simulated for demonstration purposes. 
          All events, timestamps, and processing details are seeded fixture data.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-4">
          {timelineEvents.map((event, idx) => {
            const Icon = event.icon;
            return (
              <div key={idx} className="flex gap-4 relative pl-2">
                <div className={`w-7 h-7 rounded-full bg-surface-elevated border border-border flex items-center justify-center shrink-0 z-10 ${event.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0 bg-surface rounded-xl border border-border p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className={`text-xs font-semibold ${event.color}`}>{event.title}</div>
                    <div className="text-[10px] font-mono text-text-muted shrink-0">
                      {new Date(event.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{event.detail}</p>
                  {event.meta && (
                    <div className="text-[10px] font-mono text-text-muted mt-1.5 bg-surface-elevated/40 rounded px-2 py-1">
                      {event.meta}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Workaround for BookShelf (lucide doesn't have it)
function BookShelf({ className }) {
  return <FileCheck className={className} />;
}

// ─── Main ApplicationDetails ───────────────────────────────────────────────────
export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [extractedFields, setExtractedFields] = useState([]);
  const [findings, setFindings] = useState([]);
  const [activeTab, setActiveTab] = useState('documents');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState(null);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const appRes = await applicationService.getApplicationById(id);
      setApp(appRes.data);

      const [docsRes, fieldsRes, findingsRes] = await Promise.all([
        documentService.getDocuments(id),
        extractionService.getExtractedFields(id),
        validationService.getFindings(id),
      ]);

      setDocuments(docsRes.data || []);
      setExtractedFields(fieldsRes.data || []);
      setFindings(findingsRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !app) {
    return <ErrorState message={error || 'Application not found'} onRetry={loadData} />;
  }

  const DEFAULT_DEMO_CATEGORIES = [
    { id: 'DEMO-CAT-1', name: 'Application Form', required: true, description: 'Statutory institutional application form with enrollment and division particulars.' },
    { id: 'DEMO-CAT-2', name: 'Institution Registration Document', required: true, description: 'Registered society certificate, foundation trust deed, or charter.' },
    { id: 'DEMO-CAT-3', name: 'Affiliation Document', required: true, description: 'University or state examining technical board affiliation order/letter.' },
    { id: 'DEMO-CAT-4', name: 'Approval Document', required: true, description: 'Prior sanction order, government NOC, or statutory council approval.' },
    { id: 'DEMO-CAT-5', name: 'Supporting Declaration', required: true, description: 'Compliance affidavit, registered land deed, or architect certificate.' },
  ];

  const requirementConfig = REQUIREMENT_MAP[app.applicationType];
  const isRequirementSupported = Boolean(requirementConfig?.supported && requirementConfig.requirements?.length > 0);

  const checklistItems = isRequirementSupported
    ? requirementConfig.requirements.map((req) => {
        const uploadedDoc = documents.find(
          (d) => d.category === req.document || d.name?.toLowerCase().includes(req.document.toLowerCase().slice(0, 10))
        );
        return {
          id: req.id,
          name: req.document,
          clause: req.clause,
          required: req.required,
          description: req.source || 'Regulatory requirement checklist',
          uploadedDoc,
        };
      })
    : DEFAULT_DEMO_CATEGORIES.map((cat) => {
        const uploadedDoc = documents.find((d) => d.category === cat.name);
        return {
          id: cat.id,
          name: cat.name,
          clause: null,
          required: cat.required,
          description: cat.description,
          uploadedDoc,
        };
      });

  const presentCount = checklistItems.filter((item) => Boolean(item.uploadedDoc)).length;
  const totalCount = checklistItems.length;
  const completionPercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const getDocumentProcessingBadge = (doc) => {
    if (!doc) {
      return { variant: 'pending', label: 'Missing document' };
    }
    const status = (doc.status || '').toLowerCase();
    if (status === 'extracted') {
      return { variant: 'success', label: 'Extracted (demo)' };
    }
    if (status === 'processed') {
      return { variant: 'success', label: 'Processed (demo)' };
    }
    if (status === 'uploaded') {
      return { variant: 'info', label: 'Uploaded (ready)' };
    }
    if (status === 'processing') {
      return { variant: 'pending', label: 'Processing...' };
    }
    if (status === 'partial') {
      return { variant: 'warning', label: 'Partially extracted' };
    }
    if (status === 'failed') {
      return { variant: 'error', label: 'Processing failed' };
    }
    return { variant: 'neutral', label: doc.status || 'Uploaded' };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            to="/applications"
            className="p-1.5 rounded-lg border border-border bg-surface text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-accent">{app.id}</span>
              <Badge
                variant={
                  app.status === 'Verified'
                    ? 'success'
                    : app.status === 'Discrepancy Detected'
                    ? 'error'
                    : app.status === 'Missing Documents'
                    ? 'info'
                    : 'warning'
                }
                size="sm"
                dot
              >
                {applicationStatusLabel(app.status)}
              </Badge>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary mt-0.5">
              {app.institutionName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={UploadCloud}
            onClick={() => navigate(`/applications/${app.id}/documents`)}
          >
            Upload
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={ShieldCheck}
            onClick={() => navigate(`/validation?app=${app.id}`)}
          >
            Run Validation
          </Button>
          {findings.length > 0 && (
            <Button
              variant="accent"
              size="sm"
              icon={Layers}
              onClick={() => navigate(`/applications/${app.id}/evidence`)}
            >
              Inspect Evidence
            </Button>
          )}
        </div>
      </div>

      {/* Institutional Overview Strip */}
      <div className="bg-surface rounded-2xl border border-border p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-[10px] font-mono uppercase text-text-muted">Permanent Code</span>
          <div className="font-mono text-sm font-bold text-text-primary mt-0.5">{app.institutionCode}</div>
          <div className="text-[11px] text-text-secondary mt-0.5">{app.applicationType}</div>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-text-muted">Intake Capacity</span>
          <div className="font-mono text-sm font-bold text-accent mt-0.5">
            {app.intakeCapacity || 60} Seats
          </div>
          <div className="text-[11px] text-text-secondary mt-0.5">Session: {app.academicYear}</div>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-text-muted">Contact Coordinates</span>
          <div className="text-text-primary truncate font-medium mt-0.5">{app.contactEmail}</div>
          <div className="text-text-muted font-mono text-[11px] mt-0.5">{app.contactPhone}</div>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-text-muted">Campus Location</span>
          <div className="text-text-secondary truncate mt-0.5 leading-snug">{app.address}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'documents', label: 'Document Checklist', count: `${presentCount}/${totalCount}` },
          { id: 'extractions', label: 'Extracted Entities', count: extractedFields.length },
          { id: 'findings', label: 'Compliance Findings', count: findings.length },
          { id: 'authenticity', label: 'Authenticity' },
          { id: 'passport', label: 'Evidence Passport' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab 1: Document Checklist */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          {/* Synthetic Demo Checklist Disclaimer */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-accent/5 border border-accent/20 text-xs">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="text-text-secondary leading-relaxed space-y-0.5">
              <span className="text-accent font-semibold">SYNTHETIC DEMO CHECKLIST: </span>
              {isRequirementSupported
                ? (requirementConfig.disclaimer || 'Requirements shown are from synthetic demonstration mappings. Clause mappings are not official AICTE requirements.')
                : (requirementConfig?.note || 'Requirements for this application type have not been verified against official regulatory sources. A standard demo checklist is displayed for prototype evaluation.')}
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary font-mono">
                  Configured Document Checklist — Demo
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Configured document categories for regulatory verification demonstration.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-28 bg-surface-elevated h-2 rounded-full overflow-hidden border border-border hidden sm:block">
                  <div
                    className="bg-accent h-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-accent font-semibold shrink-0">
                  {presentCount} of {totalCount} Present ({completionPercentage}%)
                </span>
              </div>
            </div>

            <div className="divide-y divide-border/40">
              {checklistItems.map((item, idx) => {
                const uploadedDoc = item.uploadedDoc;
                const statusBadge = getDocumentProcessingBadge(uploadedDoc);

                return (
                  <div
                    key={item.id || idx}
                    className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-surface-elevated/30 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 mt-0.5 sm:mt-0 ${
                          uploadedDoc
                            ? 'bg-[var(--status-success)]/10 border-[var(--status-success)]/25 text-[var(--status-success)]'
                            : 'bg-[var(--status-pending)]/10 border-[var(--status-pending)]/25 text-[var(--status-pending)]'
                        }`}
                      >
                        {uploadedDoc ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-semibold text-text-primary">
                            {item.name}
                          </span>
                          {item.clause && (
                            <span className="font-mono text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20">
                              {item.clause}
                            </span>
                          )}
                          {item.required && (
                            <span className="text-[10px] text-text-muted font-mono">(Required)</span>
                          )}
                        </div>
                        {uploadedDoc ? (
                          <div className="text-[11px] text-text-muted font-mono flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-text-secondary font-medium truncate max-w-xs">{uploadedDoc.name}</span>
                            <span>&bull;</span>
                            <span>{uploadedDoc.size}</span>
                            <span>&bull;</span>
                            <span>{uploadedDoc.pages} pages</span>
                            {uploadedDoc.uploadDate && (
                              <>
                                <span>&bull;</span>
                                <span className="hidden md:inline">Uploaded {uploadedDoc.uploadDate}</span>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="text-[11px] font-mono mt-0.5 text-[var(--status-pending)]">
                            Missing supporting document in current payload
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
                      <Badge variant={statusBadge.variant} size="sm" dot>
                        {statusBadge.label}
                      </Badge>

                      {uploadedDoc ? (
                        <>
                          {uploadedDoc.manualVerification?.status === 'manual_review_recorded' && (
                            <Badge variant="success" size="sm">Review recorded</Badge>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={Eye}
                            onClick={() => setSelectedPreviewDoc(uploadedDoc)}
                            title="Inspect document metadata"
                          >
                            Metadata
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={RefreshCw}
                            onClick={() =>
                              navigate(
                                `/applications/${app.id}/documents?category=${encodeURIComponent(item.name)}`
                              )
                            }
                            title="Replace / Re-upload document"
                          >
                            Replace
                          </Button>
                        </>
                      ) : (
                        <Link
                          to={`/applications/${app.id}/documents?category=${encodeURIComponent(item.name)}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/40 bg-accent text-accent-foreground hover:bg-accent-hover text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          Upload Now
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Extracted Fields */}
      {activeTab === 'extractions' && (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary font-mono">
                Demo Extracted Fields &amp; Sample Scores
              </h3>
              <p className="text-xs text-text-muted">
                Synthetic extraction data; live PyMuPDF/Tesseract processing requires a connected backend.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-elevated/50 border-b border-border text-[10px] font-mono uppercase text-text-muted">
                <tr>
                  <th className="px-4 py-3">Field Entity</th>
                  <th className="px-4 py-3">Extracted Value</th>
                  <th className="px-4 py-3">Source Document</th>
                  <th className="px-4 py-3">Page</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Sample score*</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono text-text-secondary">
                {extractedFields.map((field) => (
                  <tr key={field.id} className="hover:bg-surface-elevated/30">
                    <td className="px-4 py-3 font-semibold text-text-primary font-sans">
                      {field.fieldName}
                    </td>
                    <td className="px-4 py-3 font-bold text-accent">
                      {field.extractedValue}
                    </td>
                    <td className="px-4 py-3 text-text-muted truncate max-w-xs">
                      {field.sourceDocument}
                    </td>
                    <td className="px-4 py-3">Page {field.pageNumber}</td>
                    <td className="px-4 py-3 text-[11px] text-text-muted">{field.extractionMethod}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold" style={{ color: 'var(--status-success)' }}>
                        {Math.round(field.confidence * 100)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge
                        variant={field.status === 'Verified' ? 'success' : 'error'}
                        size="sm"
                      >
                        {extractionStatusLabel(field.status, field.isConfirmed)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-4 py-3 border-t border-border text-[11px] text-text-muted">* Sample scores are synthetic demo values, not measured OCR confidence. “Reviewer confirmed (demo)” records only a local prototype action.</p>
        </div>
      )}

      {/* Tab 3: Findings */}
      {activeTab === 'findings' && (
        <div className="space-y-4">
          {findings.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-border p-10 text-center">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--status-success)' }} />
              <h3 className="text-sm font-semibold text-text-primary">Zero Non-Compliances Flagged</h3>
              <p className="text-xs text-text-muted mt-1">
                No findings are present in the configured synthetic checks for this demo evaluation. This is not an official compliance result.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {findings.map((f) => (
                <div
                  key={f.id}
                  className="bg-surface rounded-xl border border-border p-4 hover:border-accent/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border bg-[var(--status-error)]/10 text-[var(--status-error)] border-[var(--status-error)]/30">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-accent">{f.id}</span>
                          <span className="font-semibold text-text-primary text-xs sm:text-sm">{f.title}</span>
                          <Badge variant="error" size="sm">{f.severity}</Badge>
                        </div>
                        <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                          {f.explanation}
                        </p>
                        <div className="mt-2 text-[11px] font-mono text-text-muted">
                          Rule: <span className="text-accent">{f.ruleId}</span> ({f.ruleName})
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/applications/${app.id}/evidence`}
                      className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs text-accent hover:bg-surface-hover hover:border-accent/40 transition-colors font-semibold shrink-0"
                    >
                      Inspect in Evidence Workbench &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Authenticity Inspector */}
      {activeTab === 'authenticity' && (
        <AuthenticityTab app={app} documents={documents} />
      )}

      {/* Tab 5: Evidence Passport */}
      {activeTab === 'passport' && (
        <EvidencePassportTab app={app} documents={documents} findings={findings} />
      )}

      {/* Document Metadata Dossier Modal */}
      {selectedPreviewDoc && (
        <Modal
          isOpen={Boolean(selectedPreviewDoc)}
          onClose={() => setSelectedPreviewDoc(null)}
          title={`Document Metadata — ${selectedPreviewDoc.name}`}
          subtitle={`${selectedPreviewDoc.category} • ${selectedPreviewDoc.size} • ${selectedPreviewDoc.pages} Pages`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-accent/5 border border-accent/20 text-xs">
              <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="text-text-secondary leading-relaxed">
                <strong className="text-accent font-semibold">Honest Metadata Dossier:</strong> In this frontend demo, uploaded document metadata is stored in browser session memory. Client-side PDF rendering is not fabricated. Real full-text OCR and page rendering require connected backend PyMuPDF services.
              </p>
            </div>

            <div className="bg-surface-elevated/40 rounded-xl border border-border p-4 space-y-3 text-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary text-sm">{selectedPreviewDoc.name}</div>
                  <div className="text-[11px] font-mono text-text-muted mt-0.5">Reference ID: {selectedPreviewDoc.id}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-text-muted font-mono uppercase text-[10px]">Category</span>
                  <div className="font-semibold text-text-primary mt-0.5">{selectedPreviewDoc.category}</div>
                </div>
                <div>
                  <span className="text-text-muted font-mono uppercase text-[10px]">Processing State</span>
                  <div className="mt-0.5">
                    <Badge variant={selectedPreviewDoc.status === 'Extracted' ? 'success' : 'info'} size="sm">
                      {selectedPreviewDoc.status || 'Uploaded'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-text-muted font-mono uppercase text-[10px]">Payload Size</span>
                  <div className="font-mono text-text-secondary mt-0.5">{selectedPreviewDoc.size}</div>
                </div>
                <div>
                  <span className="text-text-muted font-mono uppercase text-[10px]">Page Count</span>
                  <div className="font-mono text-text-secondary mt-0.5">{selectedPreviewDoc.pages} Pages</div>
                </div>
                <div>
                  <span className="text-text-muted font-mono uppercase text-[10px]">Ingestion Date</span>
                  <div className="font-mono text-text-secondary mt-0.5">{selectedPreviewDoc.uploadDate || 'Session fixture'}</div>
                </div>
                <div>
                  <span className="text-text-muted font-mono uppercase text-[10px]">Extracted Entities</span>
                  <div className="font-mono text-accent font-semibold mt-0.5">
                    {extractedFields.filter((f) => f.sourceDocument === selectedPreviewDoc.name).length} Entities
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                onClick={() => {
                  const cat = selectedPreviewDoc.category;
                  setSelectedPreviewDoc(null);
                  navigate(`/applications/${app.id}/documents?category=${encodeURIComponent(cat)}`);
                }}
              >
                Replace Document
              </Button>
              <Button variant="primary" size="sm" onClick={() => setSelectedPreviewDoc(null)}>
                Close Dossier
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
