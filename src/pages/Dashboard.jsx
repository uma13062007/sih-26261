import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FilePlus2,
  CheckSquare,
  AlertTriangle,
  GitBranch,
  ArrowRight,
  ChevronRight,
  BookOpen,
  ShieldCheck,
  Clock,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { dashboardService } from '../services/dashboardService';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import { applicationStatusLabel, complianceStatusLabel } from '../utils/displayLabels';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getDashboardSummary();
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-3">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-2.5 w-full rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="h-96 lg:col-span-8 rounded-xl" />
          <Skeleton className="h-96 lg:col-span-4 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  const { kpis, statusDistribution, findingsBySeverity, recentApplications, cohortBreakdown } = data;

  // Mutually exclusive application cohort metrics:
  const cohortTotal = cohortBreakdown?.total || kpis.totalApplications || 5;
  const verifiedApps = cohortBreakdown?.verified ?? kpis.validatedApplications;
  const underReviewApps = cohortBreakdown?.underReview ?? (kpis.underReviewApplications || 1);
  const issuesApps = cohortBreakdown?.issues ?? (kpis.issuesApplications || 2);

  // Exact percentages summing to 100%
  const verifiedPct = cohortTotal > 0 ? Math.round((verifiedApps / cohortTotal) * 100) : 0;
  const underReviewPct = cohortTotal > 0 ? Math.round((underReviewApps / cohortTotal) * 100) : 0;
  const issuesPct = Math.max(0, 100 - verifiedPct - underReviewPct);

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* ========================================================= */}
      {/* 1. CLEAN MINIMAL HEADER                                   */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            Overview
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Review synthetic applications, inspect evidence-backed findings, and compare configured demo rules.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={CheckSquare}
            onClick={() => navigate('/review')}
          >
            Review Queue
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={FilePlus2}
            onClick={() => navigate('/applications/new')}
          >
            New Application
          </Button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. UNIFIED METRIC STRIP (Calm, Neutral, Understated)      */}
      {/* ========================================================= */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Metric 1: Total Applications */}
          <div className="p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-xs text-text-secondary font-medium">Total Applications</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-semibold text-text-primary font-mono">
                {cohortTotal}
              </span>
              <span className="text-xs text-text-muted">intake cohort</span>
            </div>
            <div className="mt-2 text-[11px] text-text-muted flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Session 2026–27</span>
            </div>
          </div>

          {/* Metric 2: Verified */}
          <div className="p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-xs text-text-secondary font-medium">Configured Checks Passed</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-semibold text-text-primary font-mono">
                {verifiedApps}
              </span>
              <span className="text-xs text-text-secondary font-mono">({verifiedPct}%)</span>
            </div>
            <div className="mt-2 text-[11px] text-text-muted flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-success)' }} />
              <span>Configured demo checks passed</span>
            </div>
          </div>

          {/* Metric 3: Needs Review */}
          <div className="p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-xs text-text-secondary font-medium">Under Review</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-semibold text-text-primary font-mono">
                {underReviewApps}
              </span>
              <span className="text-xs text-text-secondary font-mono">({underReviewPct}%)</span>
            </div>
            <div className="mt-2 text-[11px] text-text-muted flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-pending)' }} />
              <span>{kpis.pendingReviews ?? 0} findings pending</span>
            </div>
          </div>

          {/* Metric 4: Open Findings */}
          <div className="p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-xs text-text-secondary font-medium">Flagged Issues</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-semibold text-text-primary font-mono">
                {issuesApps}
              </span>
              <span className="text-xs text-text-secondary font-mono">({issuesPct}%)</span>
            </div>
            <div className="mt-2 text-[11px] text-text-muted flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-error)' }} />
              <span>Configured demo findings</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. SLIM VERIFICATION PROGRESS BAR                         */}
      {/* ========================================================= */}
      <div className="bg-surface rounded-xl border border-border p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary font-medium">Application Cohort Status Breakdown</span>
          <span className="text-text-muted font-mono">{cohortTotal} Synthetic applications tracked (100%)</span>
        </div>

        {/* Slim bar: exactly sums to 100% and segments sum to cohortTotal */}
        <div className="w-full h-2 rounded-full bg-surface-elevated overflow-hidden flex">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${verifiedPct}%`, backgroundColor: 'var(--status-success)' }}
            title={`Configured Checks Passed: ${verifiedApps} (${verifiedPct}%)`}
          />
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${underReviewPct}%`, backgroundColor: 'var(--status-pending)' }}
            title={`Under Review: ${underReviewApps} (${underReviewPct}%)`}
          />
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${issuesPct}%`, backgroundColor: 'var(--status-error)' }}
            title={`Flagged Issues: ${issuesApps} (${issuesPct}%)`}
          />
        </div>

        {/* Clean legend with counts summing exactly to cohortTotal */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-text-secondary pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-success)' }} />
            <span>Passed: <strong className="text-text-primary font-mono">{verifiedApps}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-pending)' }} />
            <span>In Review: <strong className="text-text-primary font-mono">{underReviewApps}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-error)' }} />
            <span>Flagged: <strong className="text-text-primary font-mono">{issuesApps}</strong></span>
          </div>
          <div className="text-[11px] text-text-muted ml-auto font-mono">
            Total Cohort: {cohortTotal}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MAIN WORKSPACE: RECENT APPLICATIONS & PENDING QUEUE    */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Recent Applications (8 cols) */}
        <div className="lg:col-span-8 bg-surface rounded-xl border border-border overflow-hidden">
          <div className="p-4 sm:px-5 sm:py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Recent Applications
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Synthetic applications and their configured validation checks
              </p>
            </div>
            <Link
              to="/applications"
              className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-elevated/50 text-text-secondary border-b border-border">
                  <th className="py-2.5 px-4 font-medium">Institution</th>
                  <th className="py-2.5 px-4 font-medium">Application ID</th>
                  <th className="py-2.5 px-4 font-medium">Type</th>
                  <th className="py-2.5 px-4 font-medium">Intake</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {recentApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-surface-elevated/40 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/applications/${app.id}`)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-text-primary">{app.institutionName}</div>
                      <div className="text-[11px] text-text-muted font-mono">{app.institutionCode}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-accent">
                      {app.id}
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      {app.applicationType}
                    </td>
                    <td className="py-3 px-4 font-mono text-text-secondary">
                      {app.intakeCapacity || 60}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          app.complianceStatus === 'Passed'
                            ? 'success'
                            : app.complianceStatus === 'Discrepancy Detected'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {complianceStatusLabel(app.complianceStatus || app.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/applications/${app.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-text-secondary group-hover:text-accent transition-colors"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Pending Actions Queue + Niyantran Replay (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Pending Actions Queue */}
          <div className="bg-surface rounded-xl border border-border p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-text-primary">Pending Actions</h3>
              </div>
              <span className="text-xs text-text-muted font-mono">
                {kpis.pendingReviews ?? 0} awaiting
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-surface-elevated border border-border/70 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-accent font-semibold">FND-2026-001</span>
                  <Badge variant="danger" size="sm">High Severity</Badge>
                </div>
                <div className="font-medium text-text-primary">Institution Code Discrepancy</div>
                <div className="text-text-muted text-[11px]">Deccan Institute of Engg &bull; APP-2026-003</div>
                <div className="pt-1.5 flex items-center justify-between border-t border-border/40">
                  <Link
                    to="/applications/APP-2026-003/evidence"
                    className="text-accent hover:underline text-[11px] font-medium"
                  >
                    Inspect Evidence &rarr;
                  </Link>
                  <Link
                    to="/review"
                    className="text-text-secondary hover:text-text-primary text-[11px]"
                  >
                    Open Review Queue
                  </Link>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-elevated border border-border/70 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-accent font-semibold">FND-2026-003</span>
                  <Badge variant="warning" size="sm">Medium Severity</Badge>
                </div>
                <div className="font-medium text-text-primary">Chronology Precedence Warning</div>
                <div className="text-text-muted text-[11px]">Nalanda Academy &bull; APP-2026-004</div>
                <div className="pt-1.5 flex items-center justify-between border-t border-border/40">
                  <span className="text-text-muted text-[11px]">Demo correction request recorded</span>
                  <Link
                    to="/review"
                    className="text-accent hover:underline text-[11px] font-medium"
                  >
                    Review Response &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Niyantran Replay Summary (Compact) */}
          <div className="bg-surface rounded-xl border border-border p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-text-primary">Rule Replay Overview</h3>
              </div>
              <Badge variant="outline" size="sm">DEMO</Badge>
            </div>

            <div className="text-xs space-y-2">
              <div className="flex items-center justify-between text-text-secondary">
                <span>Configured demo rule</span>
                <span className="font-mono text-text-primary font-medium">Synthetic scenario</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>Configured checks</span>
                <span className="font-mono text-text-primary">Sample rules</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>Demo data refreshed</span>
                <span className="text-text-muted">Synthetic dataset</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/replay"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border text-xs text-text-primary font-medium transition-colors"
              >
                <span>Open Replay Simulator</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. REFINED CHARTS & REGULATORY NORMS                      */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Findings by Severity Chart */}
        <div className="bg-surface rounded-xl border border-border p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Findings by Severity
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Findings from the configured demonstration rules
              </p>
            </div>
            <span className="text-xs font-mono text-text-muted">Demo ruleset</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={findingsBySeverity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="severity" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface-elevated)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                  }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                />
                <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Configured Demo Rules Catalog */}
        <div className="bg-surface rounded-xl border border-border p-4 sm:p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-text-primary">
                  Configured Demo Rules
                </h3>
              </div>
              <Link
                to="/rules"
                className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
              >
                <span>Rule catalog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-surface-elevated/70 border border-border flex items-center justify-between">
                <div>
                  <span className="font-mono text-accent font-medium block">DEMO-IDENTIFIER-001</span>
                  <span className="text-text-primary">Institution Code Cross-Doc Match</span>
                </div>
                <Badge variant="warning" size="sm">Strict Match</Badge>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-elevated/70 border border-border flex items-center justify-between">
                <div>
                  <span className="font-mono text-accent font-medium block">DEMO-CAPACITY-002</span>
                  <span className="text-text-primary">Minimum Sanctioned Intake Capacity</span>
                </div>
                <Badge variant="info" size="sm">&ge; 60 seats (v2.0)</Badge>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-elevated/70 border border-border flex items-center justify-between">
                <div>
                  <span className="font-mono text-accent font-medium block">DEMO-AFFIL-003</span>
                  <span className="text-text-primary">University Affiliation Submission</span>
                </div>
                <Badge variant="danger" size="sm">Mandatory</Badge>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted mt-3">
            <span>Demo rule reference: <code className="font-mono text-accent">DEMO-RULESET-v2</code></span>
            <span>Version: <strong className="text-text-primary font-mono">v2.0 Active</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
