export function applicationStatusLabel(status) {
  const labels = {
    Verified: 'Configured checks passed (demo)',
    Validated: 'Checks evaluated (demo)',
    'Discrepancy Detected': 'Finding detected (demo)',
    'Missing Documents': 'Missing documents',
    'Under Review': 'Under review (demo)',
    'Extraction Completed': 'Demo extraction completed',
  };
  return labels[status] || status || 'Unknown';
}

export function complianceStatusLabel(status) {
  const labels = {
    Passed: 'Configured checks passed (demo)',
    'Action Required': 'Review needed (demo)',
    'Under Review': 'Under review (demo)',
    'Clarification Requested': 'Correction requested (demo)',
  };
  return labels[status] || applicationStatusLabel(status);
}

export function extractionStatusLabel(status, isConfirmed = false) {
  if (isConfirmed || status === 'Confirmed (Demo)' || status === 'Reviewed (Demo)') {
    return 'Reviewer confirmed (demo)';
  }
  if (status === 'Verified') return 'Sample value — not independently verified';
  if (status === 'Conflicting') return 'Mismatch flagged (demo)';
  if (status === 'Extracted') return 'Extracted (demo)';
  return status || 'Not evaluated';
}
