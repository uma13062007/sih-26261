import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

// Pages
import Dashboard from '../pages/Dashboard';
import Applications from '../pages/Applications';
import CreateApplication from '../pages/CreateApplication';
import ApplicationDetails from '../pages/ApplicationDetails';
import UploadDocuments from '../pages/UploadDocuments';
import ExtractionResults from '../pages/ExtractionResults';
import ValidationCenter from '../pages/ValidationCenter';
import EvidenceExplorer from '../pages/EvidenceExplorer';
import Rules from '../pages/Rules';
import RuleDetails from '../pages/RuleDetails';
import RuleVersions from '../pages/RuleVersions';
import Replay from '../pages/Replay';
import ReplayDetails from '../pages/ReplayDetails';
import ReviewCenter from '../pages/ReviewCenter';
import Reports from '../pages/Reports';
import AuditHistory from '../pages/AuditHistory';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'applications',
        element: <Applications />,
      },
      {
        path: 'applications/new',
        element: <CreateApplication />,
      },
      {
        path: 'applications/:id',
        element: <ApplicationDetails />,
      },
      {
        path: 'applications/:id/documents',
        element: <UploadDocuments />,
      },
      {
        path: 'applications/:id/findings',
        element: <ValidationCenter />,
      },
      {
        path: 'applications/:id/extraction',
        element: <ExtractionResults />,
      },
      {
        path: 'applications/:id/evidence',
        element: <EvidenceExplorer />,
      },
      {
        path: 'upload',
        element: <UploadDocuments />,
      },
      {
        path: 'extraction',
        element: <ExtractionResults />,
      },
      {
        path: 'validation',
        element: <ValidationCenter />,
      },
      {
        path: 'rules',
        element: <Rules />,
      },
      {
        path: 'rules/:id',
        element: <RuleDetails />,
      },
      {
        path: 'rules/:id/versions',
        element: <RuleVersions />,
      },
      {
        path: 'replay',
        element: <Replay />,
      },
      {
        path: 'replay/:id',
        element: <ReplayDetails />,
      },
      {
        path: 'review',
        element: <ReviewCenter />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'audit',
        element: <AuditHistory />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
