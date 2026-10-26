import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Printer, Download, ShieldCheck, FileText, CheckCircle2, 
  AlertTriangle, Clock, Building2, Award, Stamp, Sparkles, 
  ChevronRight, ExternalLink
} from 'lucide-react';
import { reportService } from '../services/reportService';
import { applicationService } from '../services/applicationService';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';

export default function Reports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(searchParams.get('appId') || 'APP-2026-001');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Load application list for dropdown
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await applicationService.getApplications();
        setApplications(res.data || []);
      } catch (err) {
        console.error('Error fetching applications for reports:', err);
      }
    };
    fetchApps();
  }, []);

  // Fetch report when selectedAppId changes
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const res = await reportService.getApplicationReport(selectedAppId);
        setReportData(res.data);
      } catch (err) {
        console.error('Error generating report:', err);
        setReportData(null);
        setLoadError(err.message || 'Could not generate the report for this application.');
        addToast('Could not load the report. Check the selected application and try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [selectedAppId, reloadKey]);

  const handlePrint = () => {
    if (!reportData || loading) {
      addToast('Load a report before printing.', 'warning');
      return;
    }
    window.print();
  };

  const csvCell = (value) => {
    let text = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
    // Neutralise spreadsheet formula prefixes in exported values.
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""').replace(/[\r\n]+/g, ' ')}"`;
  };

  const handleExportCsv = () => {
    if (!reportData) {
      addToast('No report data is available to export.', 'warning');
      return;
    }
    const app = reportData.application || {};
    const rows = [[
      'record_type', 'application_id', 'institution', 'application_status',
      'item_id', 'category', 'title', 'details', 'source', 'result', 'timestamp'
    ]];
    rows.push(['application', app.id, app.institutionName, app.status, reportData.reportId, app.applicationType, 'Synthetic application summary', app.notes, 'Demo store', app.complianceStatus, reportData.generatedAt]);
    (reportData.documents || []).forEach((doc) => rows.push([
      'document', app.id, app.institutionName, app.status, doc.id, doc.category,
      doc.name, `${doc.pages || ''} pages; ${doc.size || ''}`, 'Synthetic demo document list', doc.status || 'listed', doc.uploadDate || ''
    ]));
    (reportData.findings || []).forEach((finding) => rows.push([
      'finding', app.id, app.institutionName, app.status, finding.id, finding.ruleId,
      finding.title, finding.summary || finding.explanation, finding.evidenceSources?.map((item) => `${item.documentName || item.documentType} page ${item.pageNumber || 'n/a'}`).join('; ') || '', finding.status || finding.severity, finding.createdAt || ''
    ]));
    (reportData.auditHistory || []).forEach((event) => rows.push([
      'audit_event', app.id, app.institutionName, app.status, event.id, event.entityType,
      event.eventType, event.description, event.actor, 'Demo event; not a tamper-proof ledger', event.timestamp || ''
    ]));

    const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `niyantran-${selectedAppId}-report.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    addToast(`CSV report downloaded for ${selectedAppId}. It contains synthetic prototype data.`, 'success');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Controls Bar (Hidden during print) */}
      <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border print:hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-accent/15 text-accent border border-accent/25 flex items-center gap-1.5 font-semibold">
                <FileText className="w-3.5 h-3.5" />
                Synthetic Demo Report
              </span>
              <span className="text-xs text-text-muted font-mono">Print-Ready Output</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary tracking-tight">
              Regulatory Verification Report
            </h1>
            <p className="text-sm text-text-secondary mt-1.5 max-w-2xl leading-relaxed">
              Prototype report based on synthetic application records and configured demo checks. It is not an official compliance determination.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              icon={Download}
              onClick={handleExportCsv}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Printer}
              onClick={handlePrint}
            >
              Print / Save as PDF
            </Button>
          </div>
        </div>

        {/* Application Selector */}
        <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider shrink-0">
            Select Institution Dossier:
          </label>
          <select
            value={selectedAppId}
            onChange={(e) => {
              setSelectedAppId(e.target.value);
              setSearchParams({ appId: e.target.value });
            }}
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-surface-elevated border border-border text-text-primary font-mono focus:outline-none focus:border-accent"
            style={{ backgroundColor: 'var(--input-background)', color: 'var(--text-primary)' }}
          >
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.id} — {app.institutionName} ({app.status} • {app.complianceStatus || 'Pending'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Printable Report Document Sheet */}
      {loading ? (
        <div className="bg-surface rounded-xl p-12 border border-border space-y-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : loadError || !reportData ? (
        <div className="bg-surface rounded-xl border border-border p-8 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 mx-auto text-text-muted" />
          <h2 className="text-lg font-semibold text-text-primary">Report unavailable</h2>
          <p className="text-sm text-text-secondary">{loadError || 'Select an application with available demo data to view its report.'}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" onClick={() => setReloadKey((key) => key + 1)}>Retry report</Button>
            {applications.length > 0 && !applications.some((app) => app.id === selectedAppId) && (
              <Button variant="primary" onClick={() => { setSelectedAppId(applications[0].id); setSearchParams({ appId: applications[0].id }); }}>Open first available application</Button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border p-8 sm:p-12 shadow-2xl relative overflow-hidden print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
          {/* Subtle Watermark Stamp */}
          <div className="absolute right-8 top-12 opacity-5 pointer-events-none print:opacity-10">
            <Award className="w-96 h-96 text-text-primary" />
          </div>

          <div className="relative z-10 space-y-8">
            {/* Synthetic Demo Header Banner */}
            <div className="p-2.5 rounded-lg bg-surface-elevated/70 border border-border text-[11px] text-text-muted flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono">
              <span className="font-semibold text-accent">SYNTHETIC DEMO &bull; Prototype Regulatory Dossier</span>
              <span>SIH 26261 Demonstration Prototype &bull; Not an official AICTE certificate</span>
            </div>

            {/* Formal Letterhead */}
            <div className="border-b-2 border-border pb-6 flex flex-col sm:flex-row items-start justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono tracking-widest text-accent">
                    NIYANTRAN
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-surface-elevated text-text-muted font-mono uppercase">
                    Niyantran Demo Engine
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  AI-Powered Application Validation & Regulatory Compliance Verification
                </p>
                <p className="text-[11px] text-text-muted font-mono">
                  Smart India Hackathon 2026 • Problem Statement SIH 26261
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="text-xs font-mono text-accent block font-bold">
                  {reportData.reportId}
                </span>
                <span className="text-xs text-text-muted font-mono block">
                  Generated: {new Date(reportData.generatedAt).toLocaleString()}
                </span>
                <span className="text-xs text-text-muted block">
                  Reviewer: <strong className="text-text-primary">{reportData.generatedBy}</strong>
                </span>
              </div>
            </div>

            {/* Certificate Header Banner */}
            <div className="text-center py-4 bg-surface-elevated/40 rounded-xl border border-border/60">
              <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold block mb-1">
                Prototype Evaluation Report
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                Application Validation Summary
              </h2>
              <span className="text-xs text-text-muted mt-1 block">
                Academic session and application fields are synthetic demo data
              </span>
            </div>

            {/* Institution Profile Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-elevated/60 p-6 rounded-xl border border-border/80">
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase text-text-muted">Applicant Institution</span>
                <h3 className="text-base font-bold text-text-primary">
                  {reportData.application.institutionName}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {reportData.application.address}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-text-muted block text-[11px] font-mono">Institution Code</span>
                  <strong className="text-accent font-mono text-sm">{reportData.application.institutionCode}</strong>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px] font-mono">Application Type</span>
                  <strong className="text-text-primary">{reportData.application.applicationType}</strong>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px] font-mono">Sanctioned Intake</span>
                  <strong className="text-text-primary font-mono">{reportData.application.intakeCapacity || 60} seats</strong>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px] font-mono">Documents Listed</span>
                  <strong className="font-mono" style={{ color: 'var(--status-success)' }}>
                    {reportData.documents.length} / {reportData.application.requiredDocumentCount || 5} Documents
                  </strong>
                </div>
              </div>
            </div>

            {/* Compliance Outcome Statement */}
            <div className="p-5 rounded-xl border flex items-center justify-between gap-4 bg-surface-elevated/40 border-border">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted block">
                  Niyantran Demo Review Summary
                </span>
                <div className="text-lg font-bold text-text-primary flex items-center gap-2">
                  {reportData.findings.length === 0 ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--status-success)' }} />
                      <span style={{ color: 'var(--status-success)' }}>NO FINDINGS IN CONFIGURED DEMO CHECKS</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5" style={{ color: 'var(--status-pending)' }} />
                      <span style={{ color: 'var(--status-pending)' }}>{reportData.findings.length} FINDINGS IN SYNTHETIC VALIDATION RUN</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-text-secondary">
                  This summary reflects the configured demo data and findings stored for this application; it is not an official compliance determination.
                </p>
              </div>

              <div className="text-right">
                <Badge variant={reportData.findings.length === 0 ? 'success' : 'warning'}>
                  {reportData.application.complianceStatus || (reportData.findings.length === 0 ? 'Passed' : 'Under Review')}
                </Badge>
              </div>
            </div>

            {/* Ingested Documents Ledger */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider font-mono">
                Supporting Documents in Demo Dataset
              </h4>
              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface-elevated/80 font-mono uppercase text-[11px] text-text-muted border-b border-border">
                      <th className="py-2.5 px-4">Doc ID</th>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4">Filename</th>
                      <th className="py-2.5 px-4">Pages</th>
                      <th className="py-2.5 px-4">Extraction Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {reportData.documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="py-2.5 px-4 font-mono text-accent">{doc.id}</td>
                        <td className="py-2.5 px-4 text-text-primary font-medium">{doc.category}</td>
                        <td className="py-2.5 px-4 font-mono text-text-muted">{doc.name}</td>
                        <td className="py-2.5 px-4 font-mono text-text-secondary">{doc.pages}</td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center gap-1 font-medium text-text-secondary">
                            {doc.status || 'Status unavailable'}
                            <span className="text-[10px] text-text-muted">(demo record)</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Findings Section (if any) */}
            {reportData.findings.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider font-mono" style={{ color: 'var(--status-pending)' }}>
                  Evidentiary Discrepancy Findings
                </h4>
                <div className="space-y-2">
                  {reportData.findings.map((f) => (
                    <div key={f.id} className="p-4 rounded-xl bg-surface-elevated/60 border border-border text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-accent">{f.id} • Rule: {f.ruleId}</span>
                        <Badge variant={f.severity === 'Critical' ? 'danger' : 'warning'}>{f.severity}</Badge>
                      </div>
                      <p className="font-semibold text-text-primary">{f.title}</p>
                      <p className="text-text-secondary leading-relaxed">{f.summary}</p>
                      {f.reviewerNotes && (
                        <p className="text-[11px] text-accent pt-1">
                          Officer Note: {f.reviewerNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prototype metadata footer — intentionally not an official certificate/signature */}
            <div className="pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-text-muted uppercase block">
                  Demo Report Reference
                </span>
                <p className="text-xs font-mono text-accent break-all">{reportData.reportId}</p>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Synthetic demonstration report for SIH 26261. No cryptographic fingerprint, official verification, or statutory endorsement is asserted.
                </p>
              </div>
              <div className="text-left sm:text-right space-y-2">
                <span className="text-[11px] font-mono text-text-muted uppercase block">
                  Reviewer Attribution — Demo Profile
                </span>
                <div className="pt-2">
                  <span className="text-base font-semibold text-text-primary">{reportData.generatedBy || 'Demo Reviewer'}</span>
                </div>
                <span className="text-[11px] text-text-muted block">
                  Local prototype profile; not an authorised signatory.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
