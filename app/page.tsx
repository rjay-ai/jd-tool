'use client';
import React, { useState } from 'react';
import { LoadingSpinner, Notification, Button } from '../components/ui-components';

export default function Page() {
  const [mode, setMode] = useState<'create' | 'compare'>('create');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Create JD states
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [qualifications, setQualifications] = useState('');

  // Compare JD states
  const [jd1, setJd1] = useState('');
  const [jd2, setJd2] = useState('');

  const handleCreate = async () => {
    if (!jobTitle || !department || !responsibilities || !qualifications) {
      setNotification({
        type: 'error',
        message: 'Please fill in all fields'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          department,
          responsibilities,
          qualifications,
        }),
      });

      const data = await response.json();
      setResult(data.jobDescription);
      setNotification({
        type: 'success',
        message: 'Job description generated successfully!'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to generate job description. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!jd1 || !jd2) {
      setNotification({
        type: 'error',
        message: 'Please provide both job descriptions'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd1, jd2 }),
      });

      const data = await response.json();
      setResult(data.analysis);
      setNotification({
        type: 'success',
        message: 'Comparison completed successfully!'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to compare job descriptions. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([result], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `jd-${mode === 'create' ? 'generated' : 'comparison'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Job Description Tool</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {notification && (
          <div className="mb-6">
            <Notification type={notification.type} message={notification.message} />
          </div>
        )}

        {/* Mode Selection */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex" aria-label="Tabs">
              <button
                onClick={() => {
                  setMode('create');
                  setResult('');
                  setNotification(null);
                }}
                className={`${
                  mode === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                Create Job Description
              </button>
              <button
                onClick={() => {
                  setMode('compare');
                  setResult('');
                  setNotification(null);
                }}
                className={`${
                  mode === 'compare'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                Compare Job Descriptions
              </button>
            </nav>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {mode === 'create' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g., Engineering"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Key Responsibilities (one per line)
                </label>
                <textarea
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  rows={5}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter responsibilities..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Required Qualifications (one per line)
                </label>
                <textarea
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  rows={5}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter qualifications..."
                />
              </div>
              <Button onClick={handleCreate} loading={loading}>
                Generate Job Description
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Job Description
                </label>
                <textarea
                  value={jd1}
                  onChange={(e) => setJd1(e.target.value)}
                  rows={8}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Paste the first job description here..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Second Job Description
                </label>
                <textarea
                  value={jd2}
                  onChange={(e) => setJd2(e.target.value)}
                  rows={8}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Paste the second job description here..."
                />
              </div>
              <Button onClick={handleCompare} loading={loading}>
                Compare Job Descriptions
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {mode === 'create' ? 'Generated Job Description' : 'Comparison Results'}
              </h2>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Download
              </button>
            </div>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap bg-gray-50 rounded-md p-4 text-sm text-gray-800">
                {result}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
