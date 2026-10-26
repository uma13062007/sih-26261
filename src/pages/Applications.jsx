import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpDown,
  ChevronRight,
  Eye,
  FileCheck2,
  Building2
} from 'lucide-react';
import { applicationService } from '../services/applicationService';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import Pagination from '../components/common/Pagination';
import { applicationStatusLabel, complianceStatusLabel } from '../utils/displayLabels';

export default function Applications() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('submittedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await applicationService.getApplications({
        search: searchQuery,
        status: statusFilter,
      });
      setApplications(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [searchQuery, statusFilter]);

  // Sort logic
  const sortedApplications = [...applications].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const totalPages = Math.ceil(sortedApplications.length / pageSize) || 1;
  const paginatedApplications = sortedApplications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Status counters
  const totalCount = applications.length;
  const verifiedCount = applications.filter((a) => a.status === 'Verified').length;
  const reviewCount = applications.filter((a) => a.status === 'Under Review' || a.status === 'Discrepancy Detected').length;
  const missingDocsCount = applications.filter((a) => a.status === 'Missing Documents').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            Applications
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Manage synthetic applications, document packages, and configured demo-check results.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/applications/new')}
          >
            Create Application
          </Button>
        </div>
      </div>

      {/* Unified KPI Ribbon */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border">
          <button
            type="button"
            onClick={() => setStatusFilter('All')}
            className={`p-4 text-left transition-colors ${
              statusFilter === 'All' ? 'bg-surface-elevated' : 'hover:bg-surface-hover'
            }`}
          >
            <div className="text-xs font-medium text-text-secondary">Total Submissions</div>
            <div className="text-2xl font-semibold text-text-primary mt-1 font-mono">{totalCount}</div>
            <div className="text-[11px] text-text-muted mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Active Cycle</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('Verified')}
            className={`p-4 text-left transition-colors ${
              statusFilter === 'Verified' ? 'bg-surface-elevated' : 'hover:bg-surface-hover'
            }`}
          >
            <div className="text-xs font-medium text-text-secondary">Demo Checks Passed</div>
            <div className="text-2xl font-semibold text-text-primary mt-1 font-mono">{verifiedCount}</div>
            <div className="text-[11px] text-text-muted mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-success)' }} />
              <span>Configured demo checks</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('Discrepancy Detected')}
            className={`p-4 text-left transition-colors ${
              statusFilter === 'Discrepancy Detected' ? 'bg-surface-elevated' : 'hover:bg-surface-hover'
            }`}
          >
            <div className="text-xs font-medium text-text-secondary">Issues Flagged</div>
            <div className="text-2xl font-semibold text-text-primary mt-1 font-mono">{reviewCount}</div>
            <div className="text-[11px] text-text-muted mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-error)' }} />
              <span>Review required (demo)</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('Missing Documents')}
            className={`p-4 text-left transition-colors ${
              statusFilter === 'Missing Documents' ? 'bg-surface-elevated' : 'hover:bg-surface-hover'
            }`}
          >
            <div className="text-xs font-medium text-text-secondary">Missing Documents</div>
            <div className="text-2xl font-semibold text-text-primary mt-1 font-mono">{missingDocsCount}</div>
            <div className="text-[11px] text-text-muted mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-pending)' }} />
              <span>Checklist Incomplete</span>
            </div>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-surface p-4 rounded-xl border border-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by institution name, ID, or code..."
            className="w-full bg-surface-elevated pl-10 pr-4 py-2 rounded-lg border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Status Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-text-primary px-3 py-2 pr-8 rounded-lg border border-border text-xs focus:outline-none focus:border-accent appearance-none cursor-pointer bg-surface-elevated"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Configured Checks Passed (Demo)</option>
              <option value="Discrepancy Detected">Discrepancy Detected</option>
              <option value="Missing Documents">Missing Documents</option>
              <option value="Under Review">Under Review</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {(searchQuery || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setCurrentPage(1);
              }}
              className="text-xs text-accent hover:underline px-2 py-1 font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="bg-surface rounded-xl border border-border p-6 space-y-3">
          <Skeleton className="h-6 w-48" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchApplications} />
      ) : paginatedApplications.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No institutional applications match your criteria"
          description="Try clearing search filters or create a new technical approval filing."
          action={{
            label: 'Clear Filters',
            onClick: () => {
              setSearchQuery('');
              setStatusFilter('All');
            },
          }}
        />
      ) : (
        <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-elevated text-text-muted border-b border-border/70 font-medium">
                  <th
                    onClick={() => handleSort('id')}
                    className="py-3 px-4 cursor-pointer hover:text-text-primary transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Application ID</span>
                      <ArrowUpDown className="w-3 h-3 text-text-muted" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('institutionName')}
                    className="py-3 px-4 cursor-pointer hover:text-text-primary transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Institution Name & Program</span>
                      <ArrowUpDown className="w-3 h-3 text-text-muted" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('intakeCapacity')}
                    className="py-3 px-4 cursor-pointer hover:text-text-primary transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Intake Capacity</span>
                      <ArrowUpDown className="w-3 h-3 text-text-muted" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Documents</th>
                  <th className="py-3 px-4">Compliance Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedApplications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="hover:bg-surface-elevated/60 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-accent">
                      {app.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-text-primary">{app.institutionName}</div>
                      <div className="text-[11px] text-text-muted mt-0.5">
                        Code: {app.institutionCode} &bull; {app.applicationType}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-text-secondary">
                      {app.intakeCapacity || 60} seats
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-text-secondary">
                        {app.documentCount || 5} / {app.requiredDocumentCount || 5}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/applications/${app.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-text-muted group-hover:text-accent font-medium transition-colors"
                      >
                        <span>Workspace</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border/70 flex items-center justify-between">
              <span className="text-xs text-text-muted font-sans">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedApplications.length)} of {sortedApplications.length} entries
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
