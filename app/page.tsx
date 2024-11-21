// app/page.tsx
'use client';
import React, { useState } from 'react';
import { Upload, Download, AlertCircle, Loader } from 'lucide-react';

interface NotificationType {
  type: 'success' | 'error';
  message: string;
}

export default function Page() {
  // States
  const [mode, setMode] = useState<'create' | 'compare'>('create');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form states
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [qualifications, setQualifications] = useState('');

  // Compare states
  const [jd1, setJd1] = useState('');
  const [jd2, setJd2] = useState('');
  const [uploadedFile1, setUploadedFile1] = useState<File | null>(null);
  const [uploadedFile2, setUploadedFile2] = useState<File | null>(null);

  // Handlers
  const handleGenerate = async () => {
    // ... previous handleGenerate code ...
  };

  const handleCompare = async () => {
    // ... previous handleCompare code ...
  };

  const handleFileUpload = async (file: File, fileNumber: 1 | 2) => {
    // ... previous handleFileUpload code ...
  };

  const handleDownload = () => {
    // ... previous handleDownload code ...
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Job Description Tool
            </h1>
            <p className="text-lg text-gray-600">
              Create and compare professional job descriptions in seconds
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-8">
            <div className="border-b border-gray-200">
              <nav className="flex justify-center -mb-px" aria-label="Tabs">
                <button
                  onClick={() => {
                    setMode('create');
                    setResult('');
                    setNotification(null);
                  }}
                  className={`w-1/2 max-w-xs py-4 px-8 text-center border-b-2 font-medium text-sm transition-colors
                    ${mode === 'create'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Create Job Description
                </button>
                <button
                  onClick={() => {
                    setMode('compare');
                    setResult('');
                    setNotification(null);
                  }}
                  className={`w-1/2 max-w-xs py-4 px-8 text-center border-b-2 font-medium text-sm transition-colors
                    ${mode === 'compare'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
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
        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex items-start
            ${notification.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
            <AlertCircle className={`w-5 h-5 mr-3 flex-shrink-0
              ${notification.type === 'success' ? 'text-green-400' : 'text-red-400'}`} />
            <p className={notification.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {notification.message}
            </p>
          </div>
        )}

        {/* Create Form */}
        {mode === 'create' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 space-y-6">
              <input
                type="text"
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full text-xl font-medium px-0 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500 placeholder-gray-400"
              />
              
              <input
                type="text"
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-lg px-0 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500 placeholder-gray-400"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Responsibilities
                </label>
                <textarea
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="Enter each responsibility on a new line"
                  rows={6}
                  className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Qualifications
                </label>
                <textarea
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="Enter each qualification on a new line"
                  rows={6}
                  className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium text-sm transition-all
                  ${loading
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </div>
                ) : 'Generate Job Description'}
              </button>
            </div>
          </div>
        )}

        {/* Compare Section */}
        {mode === 'compare' && (
          <div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* First JD */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  First Job Description
                </h3>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mb-4
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-500'}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileUpload(file, 1);
                  }}
                >
                  <input
                    type="file"
                    id="jd1"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 1);
                    }}
                  />
                  <label htmlFor="jd1" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      <span className="text-blue-600 font-medium">Click to upload</span>
                      {' '}or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX</p>
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    value={jd1}
                    onChange={(e) => setJd1(e.target.value)}
                    placeholder="Or paste job description here"
                    rows={8}
                    className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {jd1 && (
                    <button
                      onClick={() => setJd1('')}
                      className="absolute top-2 right-2 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 bg-white rounded border shadow-sm"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Second JD - Similar structure */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                {/* ... Same structure as First JD ... */}
              </div>
            </div>

            <button
              onClick={handleCompare}
              disabled={loading || !jd1 || !jd2}
              className={`w-full mt-6 py-3 rounded-lg font-medium text-sm transition-all
                ${loading || !jd1 || !jd2
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Comparing...
                </div>
              ) : 'Compare Job Descriptions'}
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  {mode === 'create' ? 'Generated Job Description' : 'Comparison Results'}
                </h2>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                    {result}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
