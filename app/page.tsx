'use client';
import React, { useState } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';

export default function Page() {
  const [mode, setMode] = useState<'create' | 'compare'>('create');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  // Create JD states
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [qualifications, setQualifications] = useState('');

  // Compare JD states
  const [jd1, setJd1] = useState('');
  const [jd2, setJd2] = useState('');
  const [uploadedFile1, setUploadedFile1] = useState<File | null>(null);
  const [uploadedFile2, setUploadedFile2] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Modern Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              AI Job Description Tool
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Create and compare professional job descriptions in seconds
            </p>
          </div>

          {/* Clean Tab Navigation */}
          <div className="mt-8">
            <div className="border-b border-gray-200">
              <nav className="flex justify-center -mb-px" aria-label="Tabs">
                <button
                  onClick={() => setMode('create')}
                  className={`w-1/2 max-w-xs py-4 px-8 text-center border-b-2 font-medium text-sm transition-colors
                    ${mode === 'create'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Create Job Description
                </button>
                <button
                  onClick={() => setMode('compare')}
                  className={`w-1/2 max-w-xs py-4 px-8 text-center border-b-2 font-medium text-sm transition-colors
                    ${mode === 'compare'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Compare JDs
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Create JD Form */}
        {mode === 'create' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="space-y-6">
                {/* Job Title Input */}
                <div className="border-b border-gray-200 pb-6">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full text-lg font-medium px-0 border-0 focus:ring-0 placeholder-gray-400"
                  />
                </div>

                {/* Department Input */}
                <div className="border-b border-gray-200 pb-6">
                  <input
                    type="text"
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-lg px-0 border-0 focus:ring-0 placeholder-gray-400"
                  />
                </div>

                {/* Responsibilities */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Key Responsibilities
                  </label>
                  <textarea
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                    placeholder="Enter each responsibility on a new line"
                    rows={6}
                    className="w-full rounded-lg border-gray-200 resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Qualifications */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Required Qualifications
                  </label>
                  <textarea
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="Enter each qualification on a new line"
                    rows={6}
                    className="w-full rounded-lg border-gray-200 resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Submit Button - Sticky Bottom */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <button
                onClick={() => {}}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all
                  ${loading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                {loading ? 'Generating...' : 'Generate Job Description'}
              </button>
            </div>
          </div>
        )}

        {/* Compare JDs */}
        {mode === 'compare' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* First JD */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                First Job Description
              </h3>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center mb-4">
                <input
                  type="file"
                  id="jd1"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
                <label htmlFor="jd1" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="text-blue-600 font-medium">
                      Click to upload
                    </span>
                    {' '}or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PDF, DOC, DOCX
                  </p>
                </label>
              </div>

              {/* Or paste text */}
              <div>
                <div className="flex items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="mx-4 text-sm text-gray-500">or</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
                <textarea
                  value={jd1}
                  onChange={(e) => setJd1(e.target.value)}
                  placeholder="Paste job description here"
                  rows={8}
                  className="mt-4 w-full rounded-lg border-gray-200 resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Second JD - Same structure */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Second Job Description
              </h3>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center mb-4">
                <input
                  type="file"
                  id="jd2"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
                <label htmlFor="jd2" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="text-blue-600 font-medium">
                      Click to upload
                    </span>
                    {' '}or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PDF, DOC, DOCX
                  </p>
                </label>
              </div>

              {/* Or paste text */}
              <div>
                <div className="flex items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="mx-4 text-sm text-gray-500">or</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
                <textarea
                  value={jd2}
                  onChange={(e) => setJd2(e.target.value)}
                  placeholder="Paste job description here"
                  rows={8}
                  className="mt-4 w-full rounded-lg border-gray-200 resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Compare Button */}
        {mode === 'compare' && (
          <div className="mt-6">
            <button
              onClick={() => {}}
              disabled={loading || !jd1 || !jd2}
              className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all
                ${loading || !jd1 || !jd2
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {loading ? 'Comparing...' : 'Compare Job Descriptions'}
            </button>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                {mode === 'create' ? 'Generated Job Description' : 'Comparison Results'}
              </h2>
              <button
                onClick={() => {}}
                className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">
                  {result}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
