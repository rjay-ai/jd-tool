'use client';
import React, { useState } from 'react';
import { LoadingSpinner, Notification, Button } from '../components/ui-components';
import { Upload, Download, Check } from 'lucide-react';

// Types
type NotificationType = {
  type: 'success' | 'error';
  message: string;
} | null;

type Mode = 'create' | 'compare';

export default function Page() {
  // Main states
  const [mode, setMode] = useState<Mode>('create');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [notification, setNotification] = useState<NotificationType>(null);

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

  // File handling functions
  const handleFileDrop = async (e: React.DragEvent, fileNumber: 1 | 2) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) await processFile(file, fileNumber);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fileNumber: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file, fileNumber);
  };

  const processFile = async (file: File, fileNumber: 1 | 2) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (fileNumber === 1) {
        setUploadedFile1(file);
        setJd1(data.text);
      } else {
        setUploadedFile2(file);
        setJd2(data.text);
      }

      setNotification({
        type: 'success',
        message: `File processed successfully: ${file.name}`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Failed to process file: ${file.name}`
      });
    }
  };

  // Form submission handlers
  const handleGenerate = async () => {
    if (!jobTitle || !department || !responsibilities || !qualifications) {
      setNotification({
        type: 'error',
        message: 'Please fill in all required fields'
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
        message: 'Failed to generate job description'
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
        message: 'Failed to compare job descriptions'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([result], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `jd-${mode}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              AI Job Description Tool
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Create and compare professional job descriptions in seconds using AI
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="max-w-3xl mx-auto px-4 -mb-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-2">
              <button
                onClick={() => {
                  setMode('create');
                  setResult('');
                  setNotification(null);
                }}
                className={`py-4 px-6 text-center transition-all ${
                  mode === 'create'
                    ? 'bg-blue-50 text-blue-600 font-medium border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Create Job Description
              </button>
              <button
                onClick={() => {
                  setMode('compare');
                  setResult('');
                  setNotification(null);
                }}
                className={`py-4 px-6 text-center transition-all ${
                  mode === 'compare'
                    ? 'bg-blue-50 text-blue-600 font-medium border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Compare JDs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12 mt-8">
        {notification && (
          <div className="mb-6">
            <Notification type={notification.type} message={notification.message} />
          </div>
        )}

        {/* Create Form */}
        {mode === 'create' && (
          <div className="space-y-6 bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Enter Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xl font-medium border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:ring-0 placeholder-gray-400 transition-colors"
                />
              </div>
              
              <div>
                <input
                  type="text"
                  placeholder="Enter Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 text-xl border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:ring-0 placeholder-gray-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Key Responsibilities
                </label>
                <textarea
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="Enter key responsibilities (one per line)"
                  rows={6}
                  className="w-full rounded-lg border-2 border-gray-200 p-4 focus:border-blue-600 focus:ring-0 placeholder-gray-400 text-gray-700 text-base transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Required Qualifications
                </label>
                <textarea
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="Enter required qualifications (one per line)"
                  rows={6}
                  className="w-full rounded-lg border-2 border-gray-200 p-4 focus:border-blue-600 focus:ring-0 placeholder-gray-400 text-gray-700 text-base transition-colors"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-lg font-medium text-base transition-all
                  ${loading 
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  'Generate Professional Job Description'
                )}
              </button>
            </div>
          </div>
        )}
{/* Compare Section */}
        {mode === 'compare' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* First JD */}
              <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">First Job Description</h3>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-500 transition-all cursor-pointer bg-gray-50"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleFileDrop(e, 1)}
                >
                  <input
                    type="file"
                    id="jd1"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 1)}
                  />
                  <label htmlFor="jd1" className="cursor-pointer">
                    {uploadedFile1 ? (
                      <div className="space-y-2">
                        <Check className="w-8 h-8 text-green-500 mx-auto" />
                        <p className="text-green-600 font-medium">{uploadedFile1.name}</p>
                        <p className="text-sm text-gray-500">Click or drag to replace</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-blue-500 mx-auto" />
                        <div className="text-gray-500">
                          <span className="block text-blue-600 font-medium">
                            Choose a file
                          </span>
                          or drag and drop
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    value={jd1}
                    onChange={(e) => setJd1(e.target.value)}
                    placeholder="Or paste job description here"
                    rows={8}
                    className="w-full rounded-lg border-2 border-gray-200 p-4 focus:border-blue-600 focus:ring-0 placeholder-gray-400 text-gray-700 text-base transition-colors"
                  />
                  {jd1 && (
                    <button
                      onClick={() => setJd1('')}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Second JD */}
              <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Second Job Description</h3>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-500 transition-all cursor-pointer bg-gray-50"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleFileDrop(e, 2)}
                >
                  <input
                    type="file"
                    id="jd2"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 2)}
                  />
                  <label htmlFor="jd2" className="cursor-pointer">
                    {uploadedFile2 ? (
                      <div className="space-y-2">
                        <Check className="w-8 h-8 text-green-500 mx-auto" />
                        <p className="text-green-600 font-medium">{uploadedFile2.name}</p>
                        <p className="text-sm text-gray-500">Click or drag to replace</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-blue-500 mx-auto" />
                        <div className="text-gray-500">
                          <span className="block text-blue-600 font-medium">
                            Choose a file
                          </span>
                          or drag and drop
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    value={jd2}
                    onChange={(e) => setJd2(e.target.value)}
                    placeholder="Or paste job description here"
                    rows={8}
                    className="w-full rounded-lg border-2 border-gray-200 p-4 focus:border-blue-600 focus:ring-0 placeholder-gray-400 text-gray-700 text-base transition-colors"
                  />
                  {jd2 && (
                    <button
                      onClick={() => setJd2('')}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleCompare}
              disabled={loading || (!jd1 || !jd2)}
              className={`w-full py-4 px-6 rounded-lg font-medium text-base transition-all
                ${loading || (!jd1 || !jd2)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                'Compare Job Descriptions'
              )}
            </button>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">
                  {mode === 'create' ? 'Generated Job Description' : 'Comparison Results'}
                </h2>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-6 text-gray-800">
                  <pre className="whitespace-pre-wrap text-sm font-sans">
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
