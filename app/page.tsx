'use client';
import React, { useState } from 'react';

export default function Home() {
  const [mode, setMode] = useState('create');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  // Form states
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [jd1, setJd1] = useState('');
  const [jd2, setJd2] = useState('');

  const handleGenerate = async () => {
    // ... existing generate logic ...
  };

  const handleCompare = async () => {
    // ... existing compare logic ...
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 font-inter">
            Job Description Tool
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create and compare job descriptions with AI-powered assistance
          </p>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            <button
              onClick={() => setMode('create')}
              className={`py-4 px-6 text-sm font-medium transition-colors
                ${mode === 'create' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              Create JD
            </button>
            <button
              onClick={() => setMode('compare')}
              className={`py-4 px-6 text-sm font-medium transition-colors
                ${mode === 'compare' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              Compare JDs
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {mode === 'create' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-900"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-900"
                    placeholder="e.g., Engineering"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Key Responsibilities
                </label>
                <textarea
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-900"
                  placeholder="Enter each responsibility on a new line"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Required Qualifications
                </label>
                <textarea
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-900"
                  placeholder="Enter each qualification on a new line"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-4 rounded-lg font-medium text-sm transition-colors
                  ${loading 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  }`}
              >
                {loading ? 'Generating...' : 'Generate Job Description'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  First Job Description
                </label>
                <textarea
                  value={jd1}
                  onChange={(e) => setJd1(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-900"
                  placeholder="Paste the first job description here"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Second Job Description
                </label>
                <textarea
                  value={jd2}
                  onChange={(e) => setJd2(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-900"
                  placeholder="Paste the second job description here"
                />
              </div>

              <button
                onClick={handleCompare}
                disabled={loading}
                className={`w-full py-4 rounded-lg font-medium text-sm transition-colors
                  ${loading 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  }`}
              >
                {loading ? 'Comparing...' : 'Compare Job Descriptions'}
              </button>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {mode === 'create' ? 'Generated Job Description' : 'Comparison Results'}
              </h3>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-white p-6 rounded-lg border border-gray-200">
                  {result}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
