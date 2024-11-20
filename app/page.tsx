'use client';
import React, { useState } from 'react';
import { LoadingSpinner, Notification, Button } from '../components/ui-components';

export default function Page() {
  // State declarations
  const [mode, setMode] = useState<'create' | 'compare'>('create');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

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
        message: `Successfully processed: ${file.name}`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Failed to process file: ${file.name}`
      });
    }
  };

  // Handle form submissions
  const handleGenerate = async () => {
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

  // Download function
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">AI Job Description Tool</h1>
            <p className="mt-2 text-blue-100">Create and compare job descriptions powered by AI</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {notification && (
          <div className="mb-6">
            <Notification type={notification.type} message={notification.message} />
          </div>
        )}

        {/* Mode Selector */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => {
              setMode('create');
              setResult('');
              setNotification(null);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all
              ${mode === 'create' 
                ? 'bg-white shadow text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'}`}
          >
            Create Job Description
          </button>
          <button
            onClick={() => {
              setMode('compare');
              setResult('');
              setNotification(null);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all
              ${mode === 'compare' 
                ? 'bg-white shadow text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'}`}
          >
            Compare JDs
          </button>
        </div>

        {/* Create Form */}
        {mode === 'create' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <input
                type="text"
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-4 py-3 text-lg font-medium border-b focus:border-blue-500 focus:ring-0 placeholder-gray-400"
              />
              
              <input
                type="text"
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 text-lg border-b focus:border-blue-500 focus:ring-0 placeholder-gray-400"
              />

              <div className="p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Responsibilities
                </label>
                <textarea
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="Enter each responsibility on a new line"
                  rows={6}
                  className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </div>

              <div className="p-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Qualifications
                </label>
                <textarea
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="Enter each qualification on a new line"
                  rows={6}
                  className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </div>
            </div>

            <Button onClick={handleGenerate} loading={loading}>
              Generate Professional Job Description
            </Button>
          </div>
        )}

        {/* Compare Section */}
        {mode === 'compare' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* First JD */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">First JD</h3>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-blue-500 transition-colors"
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
                    <div className="text-gray-500">
                      <span className="block text-blue-600 font-medium">
                        Choose a file
                      </span>
                      or drag and drop
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX
                    </p>
                  </label>
                  {uploadedFile1 && (
                    <div className="mt-2 text-sm text-blue-600">
                      {uploadedFile1.name}
                    </div>
                  )}
                </div>
                <textarea
                  value={jd1}
                  onChange={(e) => setJd1(e.target.value)}
                  placeholder="Or paste job description here"
                  rows={8}
                  className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </div>

              {/* Second JD */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Second JD</h3>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-blue-500 transition-colors"
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
                    <div className="text-gray-500">
                      <span className="block text-blue-600 font-medium">
                        Choose a file
                      </span>
                      or drag and drop
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX
                    </p>
                  </label>
                  {uploadedFile2 && (
                    <div className="mt-2 text-sm text-blue-600">
                      {uploadedFile2.name}
                    </div>
                  )}
                </div>
                <textarea
                  value={jd2}
                  onChange={(e) => setJd2(e.target.value)}
                  placeholder="Or paste job description here"
                  rows={8}
                  className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </div>
            </div>

            <Button onClick={handleCompare} loading={loading}>
              Compare Job Descriptions
            </Button>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {mode === 'create' ? 'Generated Job Description' : 'Comparison Results'}
              </h2>
              <button
                onClick={handleDownload}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Download
              </button>
            </div>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap bg-gray-50 rounded-lg p-4 text-sm text-gray-800">
                {result}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
