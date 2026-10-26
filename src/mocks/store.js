/**
 * NIYANTRAN Centralized Mock State Store
 * Provides persistent, reactive, synchronized mock data across all UI services.
 */

// Initial 5 Demonstration Scenarios
const initialApplications = [
  {
    id: 'APP-2026-001',
    institutionName: 'Apex Institute of Technology & Management',
    institutionCode: 'INST-1001',
    applicationType: 'Extension of Approval (EoA)',
    academicYear: '2026-2027',
    contactEmail: 'compliance@apextech.edu.in',
    contactPhone: '+91 98765 43210',
    address: 'Sector 62, Institutional Area, Noida, Uttar Pradesh 201309',
    status: 'Verified',
    submittedAt: '2026-10-18T10:30:00Z',
    updatedAt: '2026-10-22T14:15:00Z',
    documentCount: 5,
    requiredDocumentCount: 5,
    findingsCount: 0,
    criticalFindingsCount: 0,
    intakeCapacity: 120,
    complianceStatus: 'Passed',
    notes: 'Synthetic demo scenario contains no seeded mismatch for the configured checks. Not an official compliance outcome.'
  },
  {
    id: 'APP-2026-002',
    institutionName: 'Horizon College of Engineering & Research',
    institutionCode: 'INST-1015',
    applicationType: 'New Technical Campus',
    academicYear: '2026-2027',
    contactEmail: 'registrar@horizoncollege.ac.in',
    contactPhone: '+91 98450 11223',
    address: 'Plot 44, Tech Corridor, Electronic City, Bengaluru, Karnataka 560100',
    status: 'Missing Documents',
    submittedAt: '2026-10-20T09:15:00Z',
    updatedAt: '2026-10-21T11:00:00Z',
    documentCount: 4,
    requiredDocumentCount: 5,
    findingsCount: 1,
    criticalFindingsCount: 1,
    intakeCapacity: 60,
    complianceStatus: 'Action Required',
    notes: 'Synthetic demo scenario: one configured supporting document is missing.'
  },
  {
    id: 'APP-2026-003',
    institutionName: 'Deccan Institute of Science & Technology',
    institutionCode: 'INST-1042',
    applicationType: 'Extension of Approval (EoA)',
    academicYear: '2026-2027',
    contactEmail: 'director@deccantech.edu.in',
    contactPhone: '+91 97660 55443',
    address: 'Survey 88, University Road, Pune, Maharashtra 411007',
    status: 'Discrepancy Detected',
    submittedAt: '2026-10-21T15:45:00Z',
    updatedAt: '2026-10-23T16:20:00Z',
    documentCount: 5,
    requiredDocumentCount: 5,
    findingsCount: 1,
    criticalFindingsCount: 1,
    intakeCapacity: 90,
    complianceStatus: 'Under Review',
    notes: 'Synthetic demo scenario: institution code differs between two sample documents (INST-1042 vs INST-1024).'
  },
  {
    id: 'APP-2026-004',
    institutionName: 'Nalanda Technical Academy',
    institutionCode: 'INST-1088',
    applicationType: 'Increase in Intake',
    academicYear: '2026-2027',
    contactEmail: 'principal@nalandatech.ac.in',
    contactPhone: '+91 94310 99887',
    address: 'NH-31, Knowledge Park, Rajgir, Bihar 803116',
    status: 'Under Review',
    submittedAt: '2026-10-22T08:00:00Z',
    updatedAt: '2026-10-24T09:30:00Z',
    documentCount: 5,
    requiredDocumentCount: 5,
    findingsCount: 2,
    criticalFindingsCount: 0,
    intakeCapacity: 120,
    complianceStatus: 'Clarification Requested',
    notes: 'Synthetic demo scenario: dates in two sample records appear inconsistent and require review.'
  },
  {
    id: 'APP-2026-005',
    institutionName: 'Vidya Bharti Polytechnic Institute',
    institutionCode: 'INST-1102',
    applicationType: 'Extension of Approval (EoA)',
    academicYear: '2026-2027',
    contactEmail: 'admin@vidyabhartipoly.org',
    contactPhone: '+91 99881 22334',
    address: 'G.T. Road, Industrial Area, Ludhiana, Punjab 141003',
    status: 'Validated',
    submittedAt: '2026-10-23T11:20:00Z',
    updatedAt: '2026-10-24T12:00:00Z',
    documentCount: 5,
    requiredDocumentCount: 5,
    findingsCount: 0,
    criticalFindingsCount: 0,
    intakeCapacity: 45,
    complianceStatus: 'Passed',
    notes: 'Niyantran Replay demo case: Synthetic demo scenario: intake is 45 seats. It passes the sample v1 threshold (30) and fails the sample v2 threshold (60).'
  }
];

// Regulatory Rules (Demonstration Rulebook)
const initialRules = [
  {
    id: 'DEMO-IDENTIFIER-001',
    name: 'Cross-Document Institution Code Consistency',
    category: 'Institutional Identity',
    severity: 'High',
    activeVersion: 'v1.2',
    effectiveDate: '2026-01-01',
    status: 'Active',
    description: 'Compares the institutional identifier across synthetic application and reference records. This demo rule has not been verified against an official AICTE source.',
    parameter: 'Exact string match on institution code across all submitted documents',
    expectedValue: 'Uniform Institution Code',
    versions: [
      {
        version: 'v1.0',
        effectiveDate: '2024-01-01',
        changeSummary: 'Initial automated check for exact match.',
        threshold: 'Strict Case-Sensitive Match',
        author: 'Demo Rules Administrator'
      },
      {
        version: 'v1.2',
        effectiveDate: '2026-01-01',
        changeSummary: 'Added support for hyphen-insensitive alphanumeric normalization.',
        threshold: 'Normalized Alphanumeric Exact Match',
        author: 'Demo Rules Administrator'
      }
    ]
  },
  {
    id: 'DEMO-CAPACITY-002',
    name: 'Minimum Sanctioned Intake Capacity',
    category: 'Academic Threshold',
    severity: 'High',
    activeVersion: 'v2.0',
    effectiveDate: '2026-04-01',
    status: 'Active',
    description: 'Enforces minimum enrollment threshold required for financial and operational viability in technical diploma / undergraduate programs.',
    parameter: 'Minimum intake seats per standard technical division',
    expectedValue: '>= 60 seats (v2.0) | >= 30 seats (v1.0)',
    versions: [
      {
        version: 'v1.0',
        effectiveDate: '2024-01-01',
        changeSummary: 'Legacy baseline threshold of 30 seats per technical division.',
        threshold: 30,
        author: 'Council Resolution 2024-B'
      },
      {
        version: 'v2.0',
        effectiveDate: '2026-04-01',
        changeSummary: 'Upgraded minimum intake threshold from 30 to 60 seats to enhance student-faculty economies of scale.',
        threshold: 60,
        author: 'Demo Rules Administrator'
      }
    ]
  },
  {
    id: 'DEMO-AFFIL-003',
    name: 'Mandatory Affiliation Document Submission',
    category: 'Statutory Documentation',
    severity: 'Critical',
    activeVersion: 'v1.1',
    effectiveDate: '2025-06-01',
    status: 'Active',
    description: 'Validates that a valid university affiliation continuation or provisional affiliation order is present for technical degree courses.',
    parameter: 'Document presence and valid affiliation academic session coverage',
    expectedValue: 'Verified document present',
    versions: [
      {
        version: 'v1.1',
        effectiveDate: '2025-06-01',
        changeSummary: 'Mandated digital seal extraction and university registrar signatory verification.',
        threshold: 'Document Present & Valid Seal',
        author: 'Affiliation Directorate'
      }
    ]
  },
  {
    id: 'DEMO-CHRONO-004',
    name: 'Entity Establishment & Land Deed Chronology',
    category: 'Legal Governance',
    severity: 'Medium',
    activeVersion: 'v1.0',
    effectiveDate: '2025-01-01',
    status: 'Active',
    description: 'Ensures legal chronology is logical: sponsoring Trust/Society formation date must precede or coincide with land acquisition/lease deed dates.',
    parameter: 'Society Registration Date <= Land Deed Date',
    expectedValue: 'Chronological consistency',
    versions: [
      {
        version: 'v1.0',
        effectiveDate: '2025-01-01',
        changeSummary: 'Initial temporal verification rule.',
        threshold: 'Sequential Date Precedence',
        author: 'Legal Cell'
      }
    ]
  },
  {
    id: 'REG-FACULTY-005',
    name: 'Student-to-Faculty Cadre Ratio',
    category: 'Academic Norms',
    severity: 'High',
    activeVersion: 'v2.1',
    effectiveDate: '2026-01-01',
    status: 'Active',
    description: 'Demonstration check for a configured student-to-faculty ratio. Threshold and applicability are synthetic and are not an official AICTE criterion.',
    parameter: 'Cadre ratio: Professor : Associate Prof : Assistant Prof (1:2:6)',
    expectedValue: '1:15 for UG Engineering | 1:20 for Diploma',
    versions: [
      {
        version: 'v1.0',
        effectiveDate: '2023-01-01',
        changeSummary: 'Baseline 1:20 student-faculty ratio.',
        threshold: '1:20 Ratio',
        author: 'Academic Council'
      },
      {
        version: 'v2.1',
        effectiveDate: '2026-01-01',
        changeSummary: 'Elevated UG cadre ratio to 1:15 with mandatory PhD tenure tracking.',
        threshold: '1:15 Ratio with Cadre Ratio 1:2:6',
        author: 'Demo Rules Administrator'
      }
    ]
  },
  {
    id: 'REG-INFRA-006',
    name: 'Instructional Built-Up Area Verification',
    category: 'Infrastructure',
    severity: 'Medium',
    activeVersion: 'v1.0',
    effectiveDate: '2025-01-01',
    status: 'Active',
    description: 'Synthetic demonstration check for configured building-area and intake fields. Criteria are not verified against an official regulatory source.',
    parameter: 'Minimum carpet area (sq. meters) per division and departmental lab',
    expectedValue: '>= 4.0 sq.m per enrolled student in engineering',
    versions: [
      {
        version: 'v1.0',
        effectiveDate: '2025-01-01',
        changeSummary: 'Updated synthetic demo threshold example.',
        threshold: '>= 4.0 sq.m / student',
        author: 'Demo Rules Administrator'
      }
    ]
  },
  {
    id: 'REG-LAND-007',
    name: 'Contiguous Campus Land Area Title Deed',
    category: 'Legal Governance',
    severity: 'Critical',
    activeVersion: 'v1.3',
    effectiveDate: '2025-07-01',
    status: 'Active',
    description: 'Synthetic demo check for configured land-document fields. Criteria and thresholds are not verified against an official regulatory source.',
    parameter: 'Land area >= 2.5 acres in Urban or >= 7.5 acres in Rural',
    expectedValue: 'Unencumbered contiguous registered lease >= 30 yrs or freehold',
    versions: [
      {
        version: 'v1.0',
        effectiveDate: '2022-01-01',
        changeSummary: 'Initial synthetic demo check.',
        threshold: '>= 5.0 acres rural',
        author: 'Demo Rules Administrator'
      },
      {
        version: 'v1.3',
        effectiveDate: '2025-07-01',
        changeSummary: 'Updated synthetic demo field comparison.',
        threshold: '>= 2.5 acres urban / 7.5 acres rural with GIS polygon',
        author: 'Demo Rules Administrator'
      }
    ]
  },
  {
    id: 'REG-SAFETY-008',
    name: 'Fire Safety Certificate & Occupancy Clearance',
    category: 'Statutory Documentation',
    severity: 'Critical',
    activeVersion: 'v2.0',
    effectiveDate: '2026-01-01',
    status: 'Active',
    description: 'Synthetic demo check for a configured fire-safety document type and sample validity dates. It does not verify a live issuing authority or official regulatory requirement.',
    parameter: 'NOC Validity Date >= Academic Year End Date (30 June 2027)',
    expectedValue: 'Active Fire NOC with valid issue date',
    versions: [
      {
        version: 'v2.0',
        effectiveDate: '2026-01-01',
        changeSummary: 'Updated synthetic demo validity check.',
        threshold: 'Valid NOC with QR signature',
        author: 'Demo Rules Administrator'
      }
    ]
  }
];

// Synthetic Findings
const initialFindings = [
  {
    id: 'FND-2026-001',
    applicationId: 'APP-2026-003',
    institutionName: 'Deccan Institute of Science & Technology',
    ruleId: 'DEMO-IDENTIFIER-001',
    ruleName: 'Cross-Document Institution Code Consistency',
    severity: 'High',
    issueType: 'Field Discrepancy',
    affectedField: 'institutionCode',
    title: 'Institution Code Mismatch',
    summary: 'Institution code extracted from the Application Form (INST-1042) does not match the Registration Certificate (INST-1024).',
    explanation: 'The institution codes in two synthetic demo documents do not match. This is a preliminary finding for human review, not proof of fraud or an official determination.',
    evidenceSources: [
      {
        documentType: 'Application Form',
        documentName: 'AICTE_Application_Form_2026.pdf',
        pageNumber: 1,
        extractedValue: 'INST-1042',
        coordinates: { x: 140, y: 195, width: 110, height: 24 }
      },
      {
        documentType: 'Registration Document',
        documentName: 'Society_Registration_Certificate.pdf',
        pageNumber: 2,
        extractedValue: 'INST-1024',
        coordinates: { x: 220, y: 310, width: 110, height: 24 }
      }
    ],
    recommendedAction: 'Verify the original physical documents or request administrative clarification from the applicant institution.',
    status: 'Pending Review',
    reviewerDecision: null,
    reviewerNotes: '',
    createdAt: '2026-10-23T16:20:00Z',
    updatedAt: '2026-10-23T16:20:00Z'
  },
  {
    id: 'FND-2026-002',
    applicationId: 'APP-2026-002',
    institutionName: 'Horizon College of Engineering & Research',
    ruleId: 'DEMO-AFFIL-003',
    ruleName: 'Mandatory Affiliation Document Submission',
    severity: 'Critical',
    issueType: 'Missing Document',
    affectedField: 'affiliationDocument',
    title: 'Missing University Affiliation Document',
    summary: 'The mandatory State Technical University Affiliation Order is missing from the submitted document package.',
    explanation: 'Technical approval guidelines require an active affiliation order from the examining university. No document matching this category was detected in the submitted payload.',
    evidenceSources: [
      {
        documentType: 'Document Checklist',
        documentName: 'Document_Ingestion_Manifest.json',
        pageNumber: 1,
        extractedValue: 'Affiliation Order: NOT_FOUND',
        coordinates: null
      }
    ],
    recommendedAction: 'Issue a formal regulatory notice to upload the University Affiliation Order for the 2026-27 session.',
    status: 'Pending Review',
    reviewerDecision: null,
    reviewerNotes: '',
    createdAt: '2026-10-21T11:00:00Z',
    updatedAt: '2026-10-21T11:00:00Z'
  },
  {
    id: 'FND-2026-003',
    applicationId: 'APP-2026-004',
    institutionName: 'Nalanda Technical Academy',
    ruleId: 'DEMO-CHRONO-004',
    ruleName: 'Entity Establishment & Land Deed Chronology',
    severity: 'Medium',
    issueType: 'Temporal Inconsistency',
    affectedField: 'establishmentDate',
    title: 'Society Registration Date Succeeds Land Lease Date',
    summary: 'Society Registration Certificate shows establishment in 2018, whereas the Registered Land Lease is dated 2014.',
    explanation: 'A registered entity cannot legally enter into a land lease agreement 4 years prior to its formal date of incorporation unless executed by an antecedent trust.',
    evidenceSources: [
      {
        documentType: 'Society Registration Certificate',
        documentName: 'Society_Registration_2018.pdf',
        pageNumber: 1,
        extractedValue: 'Date of Registration: 14/08/2018',
        coordinates: { x: 180, y: 150, width: 140, height: 20 }
      },
      {
        documentType: 'Land Lease Deed',
        documentName: 'Registered_Land_Lease_Deed.pdf',
        pageNumber: 1,
        extractedValue: 'Execution Date: 22/03/2014',
        coordinates: { x: 195, y: 280, width: 140, height: 20 }
      }
    ],
    recommendedAction: 'Request supporting declaration regarding parent trust succession or antecedent lease endorsement.',
    status: 'Clarification Requested',
    reviewerDecision: 'Clarification Requested',
    reviewerNotes: 'Notice sent to institutional correspondent requesting ancestral society resolution.',
    createdAt: '2026-10-24T09:30:00Z',
    updatedAt: '2026-10-24T10:15:00Z'
  }
];

// Synthetic Documents Checklist per Application
const initialDocuments = {
  'APP-2026-001': [
    { id: 'DOC-101', name: 'Application_Form_Apex_2026.pdf', category: 'Application Form', size: '2.4 MB', uploadDate: '2026-10-18', status: 'Extracted', pages: 12 },
    { id: 'DOC-102', name: 'Society_Registration_Apex.pdf', category: 'Institution Registration Document', size: '1.8 MB', uploadDate: '2026-10-18', status: 'Extracted', pages: 6 },
    { id: 'DOC-103', name: 'AKTU_Affiliation_Order_2026.pdf', category: 'Affiliation Document', size: '1.1 MB', uploadDate: '2026-10-18', status: 'Extracted', pages: 3 },
    { id: 'DOC-104', name: 'AICTE_Previous_EoA_2025.pdf', category: 'Approval Document', size: '3.0 MB', uploadDate: '2026-10-18', status: 'Extracted', pages: 8 },
    { id: 'DOC-105', name: 'Compliance_Affidavit_Declaration.pdf', category: 'Supporting Declaration', size: '850 KB', uploadDate: '2026-10-18', status: 'Extracted', pages: 4 },
  ],
  'APP-2026-002': [
    { id: 'DOC-201', name: 'Horizon_Campus_New_Application.pdf', category: 'Application Form', size: '3.1 MB', uploadDate: '2026-10-20', status: 'Extracted', pages: 16 },
    { id: 'DOC-202', name: 'Trust_Deed_Horizon_Foundation.pdf', category: 'Institution Registration Document', size: '2.2 MB', uploadDate: '2026-10-20', status: 'Extracted', pages: 9 },
    { id: 'DOC-203', name: 'State_Government_NOC.pdf', category: 'Approval Document', size: '1.4 MB', uploadDate: '2026-10-20', status: 'Extracted', pages: 5 },
    { id: 'DOC-204', name: 'Infrastructure_Architect_Certificate.pdf', category: 'Supporting Declaration', size: '4.2 MB', uploadDate: '2026-10-20', status: 'Extracted', pages: 14 },
  ],
  'APP-2026-003': [
    { id: 'DOC-301', name: 'AICTE_Application_Form_2026.pdf', category: 'Application Form', size: '2.8 MB', uploadDate: '2026-10-21', status: 'Extracted', pages: 14 },
    { id: 'DOC-302', name: 'Society_Registration_Certificate.pdf', category: 'Institution Registration Document', size: '1.9 MB', uploadDate: '2026-10-21', status: 'Extracted', pages: 7 },
    { id: 'DOC-303', name: 'Savitribai_Phule_Affiliation.pdf', category: 'Affiliation Document', size: '1.2 MB', uploadDate: '2026-10-21', status: 'Extracted', pages: 4 },
    { id: 'DOC-304', name: 'Directorate_Technical_Edu_Approval.pdf', category: 'Approval Document', size: '2.5 MB', uploadDate: '2026-10-21', status: 'Extracted', pages: 10 },
    { id: 'DOC-305', name: 'Anti_Ragging_Affidavit_2026.pdf', category: 'Supporting Declaration', size: '720 KB', uploadDate: '2026-10-21', status: 'Extracted', pages: 3 },
  ],
  'APP-2026-004': [
    { id: 'DOC-401', name: 'Nalanda_Intake_Application.pdf', category: 'Application Form', size: '2.9 MB', uploadDate: '2026-10-22', status: 'Extracted', pages: 15 },
    { id: 'DOC-402', name: 'Society_Registration_2018.pdf', category: 'Institution Registration Document', size: '1.5 MB', uploadDate: '2026-10-22', status: 'Extracted', pages: 5 },
    { id: 'DOC-403', name: 'Aryabhatta_Univ_Affiliation.pdf', category: 'Affiliation Document', size: '1.3 MB', uploadDate: '2026-10-22', status: 'Extracted', pages: 4 },
    { id: 'DOC-404', name: 'Registered_Land_Lease_Deed.pdf', category: 'Supporting Declaration', size: '5.1 MB', uploadDate: '2026-10-22', status: 'Extracted', pages: 22 },
    { id: 'DOC-405', name: 'State_AICTE_Council_Consent.pdf', category: 'Approval Document', size: '1.8 MB', uploadDate: '2026-10-22', status: 'Extracted', pages: 6 },
  ],
  'APP-2026-005': [
    { id: 'DOC-501', name: 'Vidya_Bharti_EoA_Filing.pdf', category: 'Application Form', size: '2.1 MB', uploadDate: '2026-10-23', status: 'Extracted', pages: 11 },
    { id: 'DOC-502', name: 'Educational_Society_Registration.pdf', category: 'Institution Registration Document', size: '1.7 MB', uploadDate: '2026-10-23', status: 'Extracted', pages: 6 },
    { id: 'DOC-503', name: 'Punjab_Technical_Board_Affiliation.pdf', category: 'Affiliation Document', size: '1.0 MB', uploadDate: '2026-10-23', status: 'Extracted', pages: 3 },
    { id: 'DOC-504', name: 'Prior_AICTE_Sanction_Order.pdf', category: 'Approval Document', size: '2.2 MB', uploadDate: '2026-10-23', status: 'Extracted', pages: 7 },
    { id: 'DOC-505', name: 'Faculty_Declaration_Roll.pdf', category: 'Supporting Declaration', size: '1.6 MB', uploadDate: '2026-10-23', status: 'Extracted', pages: 8 },
  ]
};

// Initial Extracted Fields (Cross-verification corpus)
const initialExtractedFields = {
  'APP-2026-003': [
    {
      id: 'FLD-301',
      fieldName: 'Institution Name',
      extractedValue: 'Deccan Institute of Science & Technology',
      sourceDocument: 'AICTE_Application_Form_2026.pdf',
      pageNumber: 1,
      extractionMethod: 'PDF/OCR demo fixture',
      confidence: 0.98,
      status: 'Verified',
      isConfirmed: false
    },
    {
      id: 'FLD-302',
      fieldName: 'Institution Code (Form)',
      extractedValue: 'INST-1042',
      sourceDocument: 'AICTE_Application_Form_2026.pdf',
      pageNumber: 1,
      extractionMethod: 'OCR RegEx Matcher',
      confidence: 0.99,
      status: 'Conflicting',
      isConfirmed: false
    },
    {
      id: 'FLD-303',
      fieldName: 'Institution Code (Registration)',
      extractedValue: 'INST-1024',
      sourceDocument: 'Society_Registration_Certificate.pdf',
      pageNumber: 2,
      extractionMethod: 'OCR RegEx Matcher',
      confidence: 0.94,
      status: 'Conflicting',
      isConfirmed: false
    },
    {
      id: 'FLD-304',
      fieldName: 'Academic Year',
      extractedValue: '2026-2027',
      sourceDocument: 'AICTE_Application_Form_2026.pdf',
      pageNumber: 1,
      extractionMethod: 'Key-Value Extractor',
      confidence: 0.99,
      status: 'Verified',
      isConfirmed: false
    },
    {
      id: 'FLD-305',
      fieldName: 'Sanctioned Intake Capacity',
      extractedValue: '90 Seats',
      sourceDocument: 'Directorate_Technical_Edu_Approval.pdf',
      pageNumber: 3,
      extractionMethod: 'Table Structure Extractor',
      confidence: 0.95,
      status: 'Verified',
      isConfirmed: false
    },
    {
      id: 'FLD-306',
      fieldName: 'Contact Email',
      extractedValue: 'director@deccantech.edu.in',
      sourceDocument: 'AICTE_Application_Form_2026.pdf',
      pageNumber: 2,
      extractionMethod: 'Entity Recognition',
      confidence: 0.97,
      status: 'Verified',
      isConfirmed: false
    }
  ]
};

// Initial Audit History
const initialAuditEvents = [
  {
    id: 'AUD-901',
    timestamp: '2026-10-24T12:00:00Z',
    eventType: 'Replay Simulation Executed',
    actor: 'Demo Reviewer',
    applicationId: 'APP-2026-005',
    description: 'Executed a synthetic replay of DEMO-CAPACITY-002 comparing demo v1.0 (30 seats) with demo v2.0 (60 seats).',
    entityType: 'Replay'
  },
  {
    id: 'AUD-902',
    timestamp: '2026-10-24T10:15:00Z',
    eventType: 'Review Action Submitted',
    actor: 'Demo Reviewer',
    applicationId: 'APP-2026-004',
    description: 'Submitted clarification request for Finding FND-2026-003 regarding chronology mismatch.',
    entityType: 'Finding'
  },
  {
    id: 'AUD-903',
    timestamp: '2026-10-23T16:20:00Z',
    eventType: 'Validation Executed',
    actor: 'Niyantran Demo Rules Engine',
    applicationId: 'APP-2026-003',
    description: 'Automated compliance rule-set executed: Flagged High Severity discrepancy on DEMO-IDENTIFIER-001.',
    entityType: 'Validation'
  },
  {
    id: 'AUD-904',
    timestamp: '2026-10-23T11:20:00Z',
    eventType: 'Application Created',
    actor: 'Vidya Bharti Admin',
    applicationId: 'APP-2026-005',
    description: 'New institutional application registered for EoA (Academic Year 2026-2027).',
    entityType: 'Application'
  },
  {
    id: 'AUD-905',
    timestamp: '2026-10-21T11:00:00Z',
    eventType: 'Document Ingestion Completed',
    actor: 'Demo Document Processor',
    applicationId: 'APP-2026-002',
    description: 'Recorded a synthetic document-processing event. Live OCR requires a connected backend.',
    entityType: 'Document'
  }
];

// Centralized In-Memory Store
class MockStore {
  constructor() {
    this.applications = [...initialApplications];
    this.rules = [...initialRules];
    this.findings = [...initialFindings];
    this.documents = { ...initialDocuments };
    this.extractedFields = { ...initialExtractedFields };
    this.auditEvents = [...initialAuditEvents];
    this.replays = [];
    this.listeners = new Set();
  }

  reset() {
    this.applications = JSON.parse(JSON.stringify(initialApplications));
    this.rules = JSON.parse(JSON.stringify(initialRules));
    this.findings = JSON.parse(JSON.stringify(initialFindings));
    this.documents = JSON.parse(JSON.stringify(initialDocuments));
    this.extractedFields = JSON.parse(JSON.stringify(initialExtractedFields));
    this.auditEvents = JSON.parse(JSON.stringify(initialAuditEvents));
    this.replays = [];
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener());
  }

  // Applications
  getApplications() {
    return [...this.applications];
  }

  getApplicationById(id) {
    return this.applications.find((app) => app.id === id) || null;
  }

  createApplication(data) {
    const id = `APP-2026-${String(this.applications.length + 1).padStart(3, '0')}`;
    const newApp = {
      id,
      institutionName: data.institutionName,
      institutionCode: data.institutionCode || `INST-${Math.floor(1000 + Math.random() * 9000)}`,
      applicationType: data.applicationType || 'Extension of Approval (EoA)',
      academicYear: data.academicYear || '2026-2027',
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      address: data.address,
      status: 'Pending Upload',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documentCount: 0,
      requiredDocumentCount: 5,
      findingsCount: 0,
      criticalFindingsCount: 0,
      intakeCapacity: Number(data.intakeCapacity) || 60,
      complianceStatus: 'Draft',
      notes: 'Newly registered application. Pending document upload.'
    };

    this.applications.unshift(newApp);
    this.documents[id] = [];
    this.addAuditEvent({
      eventType: 'Application Created',
      actor: 'Institutional Officer',
      applicationId: id,
      description: `Registered new application for ${data.institutionName} (${id}).`,
      entityType: 'Application'
    });

    this.notify();
    return newApp;
  }

  updateApplication(id, updates) {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.applications[idx] = {
        ...this.applications[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.notify();
      return this.applications[idx];
    }
    return null;
  }

  // Documents
  getDocuments(applicationId) {
    return this.documents[applicationId] || [];
  }

  markDocumentManuallyReviewed(applicationId, documentId, actor = 'Demo Reviewer') {
    const appDocuments = this.documents[applicationId] || [];
    const doc = appDocuments.find((item) => item.id === documentId);
    if (!doc) throw new Error(`Document ${documentId} was not found in application ${applicationId}.`);

    doc.manualVerification = {
      status: 'manual_review_recorded',
      actor,
      reviewedAt: new Date().toISOString(),
      isDemo: true,
    };

    this.addAuditEvent({
      eventType: 'Manual Document Review Recorded',
      actor,
      applicationId,
      description: `A manual review event was recorded for document ${documentId}. This does not establish authenticity or official registry verification.`,
      entityType: 'Document',
      entityId: documentId,
    });
    this.notify();
    return doc;
  }

  addDocuments(applicationId, newDocs) {
    if (!this.documents[applicationId]) {
      this.documents[applicationId] = [];
    }
    const formatted = newDocs.map((doc, idx) => ({
      id: `DOC-${Date.now()}-${idx}`,
      name: doc.name,
      category: doc.category || 'Supporting Declaration',
      size: `${(doc.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Uploaded',
      pages: Math.floor(Math.random() * 10) + 3
    }));

    this.documents[applicationId].push(...formatted);
    this.updateApplication(applicationId, {
      documentCount: this.documents[applicationId].length,
      status: 'Ready for Extraction'
    });

    this.addAuditEvent({
      eventType: 'Document Uploaded',
      actor: 'Compliance Ingestion User',
      applicationId,
      description: `Uploaded ${formatted.length} document(s) for ${applicationId}.`,
      entityType: 'Document'
    });

    this.notify();
    return this.documents[applicationId];
  }

  // Extracted Fields
  getExtractedFields(applicationId) {
    if (this.extractedFields[applicationId]) {
      return this.extractedFields[applicationId];
    }
    // Generate synthetic extraction if not yet present
    const app = this.getApplicationById(applicationId);
    if (!app) return [];

    const generated = [
      {
        id: `FLD-${Date.now()}-1`,
        fieldName: 'Institution Name',
        extractedValue: app.institutionName,
        sourceDocument: 'Application_Form.pdf',
        pageNumber: 1,
        extractionMethod: 'PDF/OCR demo fixture',
        confidence: 0.99,
        status: 'Verified',
        isConfirmed: false
      },
      {
        id: `FLD-${Date.now()}-2`,
        fieldName: 'Institution Code',
        extractedValue: app.institutionCode,
        sourceDocument: 'Application_Form.pdf',
        pageNumber: 1,
        extractionMethod: 'OCR RegEx',
        confidence: 0.96,
        status: 'Verified',
        isConfirmed: false
      },
      {
        id: `FLD-${Date.now()}-3`,
        fieldName: 'Sanctioned Intake Capacity',
        extractedValue: `${app.intakeCapacity || 60} Seats`,
        sourceDocument: 'Approval_Document.pdf',
        pageNumber: 2,
        extractionMethod: 'Table Extractor',
        confidence: 0.95,
        status: 'Verified',
        isConfirmed: false
      }
    ];

    this.extractedFields[applicationId] = generated;
    return generated;
  }

  confirmExtractedField(applicationId, fieldId) {
    const fields = this.extractedFields[applicationId] || [];
    const target = fields.find((f) => f.id === fieldId);
    if (target) {
      target.status = 'Verified';
      target.isConfirmed = true;
      target.confirmedBy = 'Demo Reviewer';
      this.notify();
      return target;
    }
    return null;
  }

  // Validation & Findings
  getFindings(applicationId = null) {
    if (!applicationId) return [...this.findings];
    return this.findings.filter((f) => f.applicationId === applicationId);
  }

  getFindingById(id) {
    return this.findings.find((f) => f.id === id) || null;
  }

  runValidation(applicationId) {
    const app = this.getApplicationById(applicationId);
    if (!app) throw new Error(`Application ${applicationId} not found`);

    // In mock mode, calculate rule results based on application scenario
    let appFindings = this.getFindings(applicationId);

    // If APP-2026-001, zero findings
    if (applicationId === 'APP-2026-001') {
      this.updateApplication(applicationId, {
        status: 'Verified',
        complianceStatus: 'Passed',
        findingsCount: 0,
        criticalFindingsCount: 0
      });
    }

    this.addAuditEvent({
      eventType: 'Validation Executed',
      actor: 'Niyantran Demo Rules Engine',
      applicationId,
      description: `Ran configured synthetic demo checks. Result: ${appFindings.length} sample findings.`,
      entityType: 'Validation'
    });

    this.notify();
    return {
      applicationId,
      totalChecks: 14,
      passedChecks: 14 - appFindings.length,
      failedChecks: appFindings.length,
      findings: appFindings,
      timestamp: new Date().toISOString()
    };
  }

  submitReviewAction(findingId, { action, reviewerNotes }) {
    const finding = this.findings.find((f) => f.id === findingId);
    if (!finding) throw new Error(`Finding ${findingId} not found`);

    finding.status = action;
    finding.reviewerDecision = action;
    finding.reviewerNotes = reviewerNotes;
    finding.reviewedBy = 'Demo Reviewer';
    finding.reviewedAt = new Date().toISOString();

    this.addAuditEvent({
      eventType: 'Review Action Submitted',
      actor: 'Demo Reviewer',
      applicationId: finding.applicationId,
      description: `Marked finding ${finding.id} (${finding.title}) as "${action}". Note: "${reviewerNotes || 'No notes'}"`,
      entityType: 'Review'
    });

    this.notify();
    return finding;
  }

  // Rules & Replay
  getRules() {
    return [...this.rules];
  }

  getRuleById(id) {
    return this.rules.find((r) => r.id === id) || null;
  }

  createRuleVersion(ruleId, versionData) {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (!rule) throw new Error(`Rule ${ruleId} not found`);

    const newVer = {
      version: versionData.version,
      effectiveDate: versionData.effectiveDate || new Date().toISOString().split('T')[0],
      changeSummary: versionData.changeSummary,
      threshold: versionData.threshold,
      author: 'Demo Rules Administrator'
    };

    rule.versions.unshift(newVer);
    rule.activeVersion = newVer.version;

    this.addAuditEvent({
      eventType: 'Rule Version Created',
      actor: 'Demo Reviewer',
      applicationId: 'GLOBAL',
      description: `Created revision ${newVer.version} for ${rule.id} (${rule.name}).`,
      entityType: 'Rule'
    });

    this.notify();
    return rule;
  }

  // Synthetic Regulatory Change Replay: currently supports the intake-capacity demo rule only.
  executeReplay({ ruleId, oldVersion, newVersion, applicationIds = [] }) {
    const rule = this.getRuleById(ruleId);
    if (!rule) throw new Error(`Rule ${ruleId} not found`);
    if (ruleId !== 'DEMO-CAPACITY-002') {
      throw new Error('The current replay demo supports only the Minimum Sanctioned Intake Capacity rule. Other rules are view-only until their evaluators are implemented.');
    }

    const oldRuleVersion = (rule.versions || []).find((version) => version.version === oldVersion);
    const newRuleVersion = (rule.versions || []).find((version) => version.version === newVersion);
    const oldThreshold = Number(oldRuleVersion?.threshold);
    const newThreshold = Number(newRuleVersion?.threshold);
    if (!oldRuleVersion || !newRuleVersion || !Number.isFinite(oldThreshold) || !Number.isFinite(newThreshold)) {
      throw new Error('Choose two existing numeric threshold versions for the supported demo rule.');
    }
    if (oldVersion === newVersion) {
      throw new Error('Choose different rule versions to compare their impact.');
    }

    const targetApps = applicationIds.length > 0
      ? this.applications.filter((app) => applicationIds.includes(app.id))
      : this.applications;

    const results = targetApps.map((app) => {
      const capacity = Number(app.intakeCapacity ?? 0);
      const oldResult = capacity >= oldThreshold ? 'PASS' : 'FAIL';
      const newResult = capacity >= newThreshold ? 'PASS' : 'FAIL';
      let impact = 'Unchanged';
      if (oldResult === 'PASS' && newResult === 'FAIL') impact = 'Newly Failing';
      else if (oldResult === 'FAIL' && newResult === 'PASS') impact = 'Newly Passing';

      return {
        applicationId: app.id,
        institutionName: app.institutionName,
        intakeCapacity: capacity,
        sourceField: `intakeCapacity = ${capacity} seats`,
        parameterDiff: `${oldVersion} (≥${oldThreshold}) → ${newVersion} (≥${newThreshold})`,
        requiresReReview: impact !== 'Unchanged',
        oldResult,
        newResult,
        impact,
        explanation: impact === 'Newly Failing'
          ? `Sample intake (${capacity}) passed ${oldVersion} (minimum ${oldThreshold}) but does not meet ${newVersion} (minimum ${newThreshold}). Human review is recommended.`
          : impact === 'Newly Passing'
          ? `Sample intake (${capacity}) did not meet ${oldVersion} (minimum ${oldThreshold}) but meets ${newVersion} (minimum ${newThreshold}). Human review is recommended.`
          : `The sample outcome is unchanged under ${oldVersion} (minimum ${oldThreshold}) and ${newVersion} (minimum ${newThreshold}).`
      };
    });

    const newlyFailing = results.filter((result) => result.impact === 'Newly Failing').length;
    const newlyPassing = results.filter((result) => result.impact === 'Newly Passing').length;
    const unchanged = results.filter((result) => result.impact === 'Unchanged').length;
    const requiringReview = results.filter((result) => result.requiresReReview).length;

    const replaySummary = {
      replayId: `REP-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ruleId,
      ruleName: rule.name,
      oldVersion,
      newVersion,
      oldThreshold,
      newThreshold,
      executedAt: new Date().toISOString(),
      totalEvaluated: results.length,
      totalSimulated: results.length,
      unchanged,
      newlyFailing,
      newlyPassing,
      requiringReview,
      results,
      dataSource: 'Synthetic demo dataset; not official application history.'
    };

    this.replays.unshift(replaySummary);
    this.replays = this.replays.slice(0, 25);

    this.addAuditEvent({
      eventType: 'Replay Simulation Executed',
      actor: 'Demo Reviewer',
      applicationId: 'MULTIPLE',
      entityId: replaySummary.replayId,
      description: `Synthetic replay ${replaySummary.replayId} compared ${ruleId} (${oldVersion} -> ${newVersion}); ${newlyFailing} sample applications changed to failing.`,
      entityType: 'Replay'
    });

    this.notify();
    return replaySummary;
  }

  getReplayById(id) {
    return this.replays.find((replay) => replay.replayId === id) || null;
  }

  getReplays() {
    return [...this.replays];
  }

  // Audit Events
  getAuditEvents(filter = {}) {
    let list = [...this.auditEvents];
    if (filter.eventType) {
      list = list.filter((e) => e.eventType === filter.eventType);
    }
    if (filter.applicationId) {
      list = list.filter((e) => e.applicationId === filter.applicationId);
    }
    return list;
  }

  addAuditEvent(event) {
    const entry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      ...event
    };
    this.auditEvents.unshift(entry);
    return entry;
  }

  // Dashboard Summary
  getDashboardSummary() {
    const apps = this.applications;
    const totalApps = apps.length;
    
    // Mutually exclusive application cohort breakdown (sums to totalApps)
    const verifiedApps = apps.filter((a) => a.status === 'Verified' || a.complianceStatus === 'Passed').length;
    const underReviewApps = apps.filter((a) => a.status === 'Under Review').length;
    const issuesApps = apps.filter((a) => a.status === 'Discrepancy Detected' || a.status === 'Missing Documents').length;
    
    // Overlapping findings metrics (distinct from application cohort status)
    const pendingReviewFindings = this.findings.filter((f) => f.status === 'Pending Review').length;
    const totalOpenFindings = this.findings.filter((f) => f.status !== 'Resolved' && f.status !== 'Accepted').length;
    
    const recentRuleChanges = this.auditEvents.filter((event) => /Rule Version Created|Rule Updated|Replay Simulation Executed/.test(event.eventType || '')).length;
    const averageProcessingTime = 'Not measured';

    // Mutually exclusive status counts for donut chart
    const statusCounts = {
      'Verified': verifiedApps,
      'Under Review': underReviewApps,
      'Discrepancy Detected': apps.filter((a) => a.status === 'Discrepancy Detected').length,
      'Missing Documents': apps.filter((a) => a.status === 'Missing Documents').length,
    };

    return {
      kpis: {
        totalApplications: totalApps,
        validatedApplications: verifiedApps,
        underReviewApplications: underReviewApps,
        issuesApplications: issuesApps,
        pendingReviews: pendingReviewFindings,
        totalOpenFindings,
        applicationsWithIssues: issuesApps,
        recentRuleChanges,
        averageProcessingTime
      },
      cohortBreakdown: {
        verified: verifiedApps,
        underReview: underReviewApps,
        issues: issuesApps,
        total: totalApps,
        verifiedPct: totalApps > 0 ? Math.round((verifiedApps / totalApps) * 100) : 0,
        underReviewPct: totalApps > 0 ? Math.round((underReviewApps / totalApps) * 100) : 0,
        issuesPct: totalApps > 0 ? Math.round((issuesApps / totalApps) * 100) : 0,
      },
      statusDistribution: [
        { status: 'Verified', count: verifiedApps, color: '#77B89D' },
        { status: 'Under Review', count: underReviewApps, color: '#D9B477' },
        { status: 'Discrepancy', count: statusCounts['Discrepancy Detected'], color: '#D48D94' },
        { status: 'Missing Docs', count: statusCounts['Missing Documents'], color: '#8BB9D1' },
      ],
      findingsBySeverity: [
        { severity: 'Critical', count: this.findings.filter((f) => f.severity === 'Critical').length },
        { severity: 'High', count: this.findings.filter((f) => f.severity === 'High').length },
        { severity: 'Medium', count: this.findings.filter((f) => f.severity === 'Medium').length },
        { severity: 'Low', count: this.findings.filter((f) => f.severity === 'Low').length },
      ],
      recentActivity: this.auditEvents.slice(0, 6),
      recentApplications: apps.slice(0, 5)
    };
  }
}

// Singleton instance
export const mockStore = new MockStore();
