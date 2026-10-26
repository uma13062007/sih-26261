import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  Trash2,
  Play,
  Check,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { extractionStatusLabel } from '../utils/displayLabels';
import { documentService } from '../services/documentService';
import { extractionService } from '../services/extractionService';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Stepper from '../components/common/Stepper';

const CATEGORIES = [
  'Application Form',
  'Institution Registration Document',
  'Affiliation Document',
  'Approval Document',
  'Supporting Declaration',
];

export default function UploadDocuments() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const requestedCategory = searchParams.get('category');
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(
    id || searchParams.get('app') || 'APP-2026-002'
  );
  const [existingDocs, setExistingDocs] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractedFields, setExtractedFields] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Sync selectedAppId if route id or searchParam changes
  useEffect(() => {
    const routeOrQueryAppId = id || searchParams.get('app');
    if (routeOrQueryAppId && routeOrQueryAppId !== selectedAppId) {
      setSelectedAppId(routeOrQueryAppId);
    }
  }, [id, searchParams]);

  // Load applications & existing documents
  useEffect(() => {
    const loadApps = async () => {
      try {
        const res = await applicationService.getApplications();
        setApplications(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadApps();
  }, []);

  const loadDocuments = async () => {
    if (!selectedAppId) return;
    try {
      const res = await documentService.getDocuments(selectedAppId);
      setExistingDocs(res.data || []);
      const fieldsRes = await extractionService.getExtractedFields(selectedAppId);
      setExtractedFields(fieldsRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [selectedAppId]);

  // File drop handler
  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer?.files || e.target?.files || []);
    const validPdfs = droppedFiles.filter((f) => f.type === 'application/pdf' || f.name.endsWith('.pdf'));

    if (validPdfs.length < droppedFiles.length) {
      addToast({
        title: 'Invalid File Format',
        message: 'Only PDF documents are accepted by the current demo workflow.',
        type: 'warning',
      });
    }

    const defaultCat = (requestedCategory && CATEGORIES.includes(requestedCategory))
      ? requestedCategory
      : null;

    const formatted = validPdfs.map((f, idx) => ({
      file: f,
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      category: defaultCat || CATEGORIES[idx % CATEGORIES.length] || 'Supporting Declaration',
      progress: 0,
      status: 'Ready',
    }));

    setFilesToUpload((prev) => [...prev, ...formatted]);
  };

  const removeFile = (index) => {
    setFilesToUpload((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateCategory = (index, cat) => {
    setFilesToUpload((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, category: cat } : item))
    );
  };

  // Upload simulation
  const handleUpload = async () => {
    if (filesToUpload.length === 0) return;
    try {
      setUploading(true);
      // Simulate progress bar increments
      for (let p = 25; p <= 100; p += 25) {
        setFilesToUpload((prev) => prev.map((f) => ({ ...f, progress: p })));
        await new Promise((r) => setTimeout(r, 120));
      }

      await documentService.uploadDocuments(
        selectedAppId,
        filesToUpload.map((f) => ({
          name: f.name,
          category: f.category,
          size: f.file.size,
        }))
      );

      addToast({
        title: 'Upload Completed',
        message: `Successfully uploaded ${filesToUpload.length} document(s) to ${selectedAppId}.`,
        type: 'success',
      });

      setFilesToUpload([]);
      loadDocuments();
    } catch (err) {
      addToast({
        title: 'Upload Error',
        message: err.message || 'Failed to upload documents',
        type: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  // Extraction trigger
  const handleTriggerExtraction = async () => {
    try {
      setExtracting(true);
      const res = await extractionService.triggerExtraction(selectedAppId);
      setExtractedFields(res.data || []);
      addToast({
        title: 'Demo Extraction Refreshed',
        message: 'Synthetic extraction rows refreshed. Actual PyMuPDF/Tesseract processing requires a connected backend and live mode.',
        type: 'success',
      });
      loadDocuments();
    } catch (err) {
      addToast({
        title: 'Extraction Failed',
        message: err.message || 'Extraction pipeline error',
        type: 'error',
      });
    } finally {
      setExtracting(false);
    }
  };

  // Confirm field handler
  const handleConfirmField = async (fieldId) => {
    try {
      await extractionService.confirmField(selectedAppId, fieldId);
      addToast({
        title: 'Field Confirmed',
        message: 'Field review state updated in the current demo session.',
        type: 'success',
      });
      loadDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  const selectedApp = applications.find((a) => a.id === selectedAppId);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 font-semibold">
              Document Pipeline
            </span>
            <span className="text-xs text-text-muted font-mono">&bull; Demo document ingestion</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Document Ingestion & OCR Extraction
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Upload synthetic PDF files, assign demo document categories, and inspect extraction results. Live processing requires the connected backend.
          </p>
        </div>

        {extractedFields.length > 0 && (
          <Button
            variant="primary"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate(`/validation?app=${selectedAppId}`)}
          >
            Proceed to Validation
          </Button>
        )}
      </div>

      {/* Target Application Selector */}
      <div className="bg-surface rounded-2xl border border-border p-4 shadow-surface flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-semibold text-text-secondary font-mono uppercase shrink-0">
            Target Application:
          </label>
          <div className="relative w-full sm:w-96">
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              style={{
                backgroundColor: 'var(--surface-elevated)',
                color: 'var(--text-primary)',
              }}
              className="w-full text-text-primary px-3 py-1.5 pr-8 rounded-lg border border-border text-xs font-semibold focus:outline-none focus:border-accent appearance-none cursor-pointer"
            >
              {applications.map((app) => (
                <option
                  key={app.id}
                  value={app.id}
                  style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-primary)' }}
                >
                  {app.id} — {app.institutionName} ({app.status})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {selectedApp && (
          <div className="text-xs font-mono text-text-muted">
            Uploaded: <span className="font-bold text-accent">{existingDocs.length}/5</span> Statutory Categories
          </div>
        )}
      </div>

      {/* Preselected category indicator if active */}
      {requestedCategory && CATEGORIES.includes(requestedCategory) && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-accent/10 border border-accent/20 text-xs">
          <div className="flex items-center gap-2 text-text-primary">
            <span className="font-semibold text-accent font-mono uppercase text-[10px]">Pre-selected Category:</span>
            <span className="font-semibold">{requestedCategory}</span>
            <span className="text-text-muted hidden sm:inline">&bull; Dropped files will automatically be classified under this category.</span>
          </div>
          <button
            type="button"
            onClick={() => navigate(id ? `/applications/${id}/documents` : `/upload?app=${selectedAppId}`)}
            className="text-[11px] text-text-muted hover:text-text-primary underline font-medium"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Grid: Upload Dropzone & Category Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Drag & Drop Ingestion Box (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className="bg-surface rounded-2xl border-2 border-dashed border-border hover:border-accent p-8 text-center cursor-pointer transition-all hover:bg-surface-elevated/20 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="application/pdf"
              onChange={handleFileDrop}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-accent mx-auto mb-3 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">
              Drop supporting PDF files here or <span className="text-accent underline">browse</span>
            </h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto mt-1">
              PDF files only. In mock mode, upload metadata and sample extraction results are simulated; files are not encrypted or sent to a live backend by this demo.
            </p>
          </div>

          {/* Pending Upload Queue */}
          {filesToUpload.length > 0 && (
            <div className="bg-surface rounded-2xl border border-border p-4 shadow-surface space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-semibold uppercase text-text-primary font-mono">
                  Upload Queue ({filesToUpload.length})
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={uploading}
                  onClick={handleUpload}
                >
                  Upload All Files
                </Button>
              </div>

              <div className="space-y-2">
                {filesToUpload.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-surface-elevated border border-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate flex-1">
                      <FileText className="w-4 h-4 text-accent shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold text-text-primary truncate">{item.name}</div>
                        <div className="text-[10px] text-text-muted font-mono">{item.size}</div>
                      </div>
                    </div>

                    {/* Category Selector */}
                    <div className="w-48 shrink-0">
                      <select
                        value={item.category}
                        onChange={(e) => updateCategory(idx, e.target.value)}
                        style={{
                          backgroundColor: 'var(--surface)',
                          color: 'var(--text-primary)',
                        }}
                        className="w-full text-text-primary px-2 py-1 rounded border border-border text-[11px] focus:outline-none focus:border-accent"
                      >
                        {CATEGORIES.map((cat) => (
                          <option
                            key={cat}
                            value={cat}
                            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
                          >
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => removeFile(idx)}
                      className="text-text-muted hover:text-[var(--status-error)] transition-colors p-1 rounded"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Statutory Category Checklist (5 Cols) */}
        <div className="lg:col-span-5 bg-surface rounded-2xl border border-border p-5 shadow-surface space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary font-mono">
                Configured Document Checklist — Demo
              </h3>
              <p className="text-[11px] text-text-muted">Configured document categories for demonstration review</p>
            </div>
            <span className="text-xs font-mono text-accent font-bold">
              {existingDocs.length}/5
            </span>
          </div>

          <div className="space-y-2">
            {CATEGORIES.map((cat, idx) => {
              const uploaded = existingDocs.find((d) => d.category === cat);
              const isTargetCategory = cat === requestedCategory;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                    uploaded
                      ? 'bg-[var(--status-success)]/10 border-[var(--status-success)]/25'
                      : isTargetCategory
                      ? 'bg-accent/5 border-accent/40 ring-1 ring-accent/30'
                      : 'bg-surface-elevated/40 border-border'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {uploaded ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--status-success)' }} />
                    ) : (
                      <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: 'var(--status-pending)' }} />
                    )}
                    <div>
                      <div className="font-semibold text-text-primary flex items-center gap-1.5">
                        <span>{cat}</span>
                        {isTargetCategory && !uploaded && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-accent/15 text-accent font-mono font-medium">Target</span>
                        )}
                      </div>
                      {uploaded ? (
                        <div className="text-[10px] text-text-muted font-mono">
                          {uploaded.name} ({uploaded.size})
                        </div>
                      ) : (
                        <div className="text-[10px] font-mono" style={{ color: 'var(--status-pending)' }}>
                          Pending document ingestion
                        </div>
                      )}
                    </div>
                  </div>

                  {uploaded && (
                    <button
                      onClick={() => setPreviewDoc(uploaded)}
                      className="p-1 rounded text-text-muted hover:text-accent hover:bg-surface-hover"
                      title="Preview Document Metadata"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Trigger Extraction Button */}
          <div className="pt-3 border-t border-border">
            <Button
              variant="secondary"
              size="sm"
              icon={Sparkles}
              isLoading={extracting}
              disabled={existingDocs.length === 0}
              onClick={handleTriggerExtraction}
              className="w-full"
            >
              Refresh Demo Extraction Results
            </Button>
          </div>
        </div>
      </div>

      {/* Extracted Fields Table */}
      {extractedFields.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-surface space-y-0">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Extracted Structured Entities
              </h3>
              <p className="text-xs text-text-muted">
                Demo extraction values and field-review states. Live PyMuPDF/Tesseract processing requires the connected backend.
              </p>
            </div>
            <span className="text-xs font-mono text-accent">{extractedFields.length} entities extracted</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background border-b border-border text-[10px] font-mono uppercase text-text-muted">
                <tr>
                  <th className="px-4 py-3">Field Entity</th>
                  <th className="px-4 py-3">Extracted Value</th>
                  <th className="px-4 py-3">Source Document</th>
                  <th className="px-4 py-3">Page</th>
                  <th className="px-4 py-3">Sample score*</th>
                  <th className="px-4 py-3">Verification</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono text-text-secondary">
                {extractedFields.map((field) => (
                  <tr key={field.id} className="hover:bg-surface-elevated/40">
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
                    <td className="px-4 py-3">
                      <span className="font-bold" style={{ color: 'var(--status-success)' }}>
                        {Math.round(field.confidence * 100)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={field.status === 'Conflicting' ? 'warning' : 'info'}
                        size="sm"
                      >
                        {extractionStatusLabel(field.status, field.isConfirmed)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!field.isConfirmed ? (
                        <button
                          onClick={() => handleConfirmField(field.id)}
                          className="px-2 py-1 rounded bg-accent/15 border border-accent/30 text-[10px] font-sans font-semibold text-accent hover:bg-accent/25 transition-colors"
                        >
                          Confirm Value
                        </button>
                      ) : (
                        <span className="text-[10px] font-sans font-semibold inline-flex items-center gap-1" style={{ color: 'var(--status-success)' }}>
                          <Check className="w-3 h-3" /> Confirmed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          title={`Document Metadata — ${previewDoc.name}`}
          subtitle={`${previewDoc.category} • ${previewDoc.size} • ${previewDoc.pages} Pages`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            {/* Honest metadata notice */}
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
                  <div className="font-semibold text-text-primary text-sm">{previewDoc.name}</div>
                  <div className="text-[11px] font-mono text-text-muted mt-0.5">Reference ID: {previewDoc.id}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-text-muted font-mono uppercase text-[10px]">Category</span>
                  <div className="font-semibold text-text-primary mt-0.5">{previewDoc.category}</div>
                </div>
                <div>
                  <span className="text-text-muted font-mono uppercase text-[10px]">Processing State</span>
                  <div className="mt-0.5">
                    <Badge variant={previewDoc.status === 'Extracted' ? 'success' : 'info'} size="sm">
                      {previewDoc.status || 'Uploaded'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-text-muted font-mono uppercase text-[10px]">Payload Size</span>
                  <div className="font-mono text-text-secondary mt-0.5">{previewDoc.size}</div>
                </div>
                <div>
                  <span className="text-text-muted font-mono uppercase text-[10px]">Page Count</span>
                  <div className="font-mono text-text-secondary mt-0.5">{previewDoc.pages} Pages</div>
                </div>
                <div>
                  <span className="text-text-muted font-mono uppercase text-[10px]">Ingestion Date</span>
                  <div className="font-mono text-text-secondary mt-0.5">{previewDoc.uploadDate || 'Session fixture'}</div>
                </div>
                <div>
                  <span className="text-text-muted font-mono uppercase text-[10px]">Target Application</span>
                  <div className="font-mono text-accent font-semibold mt-0.5">{selectedAppId}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setPreviewDoc(null)}>
                Close Dossier
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
