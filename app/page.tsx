'use client';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader, RefreshCw } from 'lucide-react';

export default function Home() {
  const [mode, setMode] = useState('create');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [uploadMethod, setUploadMethod] = useState('text'); // 'text' or 'file'

  // Create JD states
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [qualifications, setQualifications] = useState('');

  // Compare JD states
  const [jd1, setJd1] = useState('');
  const [jd2, setJd2] = useState('');

  // File handling
  const onDrop1 = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setJd1(data.text);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }, []);

  const onDrop2 = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setJd2(data.text);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }, []);

  const dropzone1 = useDropzone({
    onDrop: onDrop1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const dropzone2 = useDropzone({
    onDrop: onDrop2,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const handleGenerate = async () => {
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
      setResult(data.jobDescription || data.error);
    } catch (error) {
      setResult('Failed to generate job description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!jd1 || !jd2) {
      setResult('Please provide both job descriptions.');
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
      setResult(data.analysis || data.error);
    } catch (error) {
      setResult('Failed to compare job descriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Job Description Tool</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Mode Selector */}
          <div className="border-b border-gray-200">
            <nav className="flex" aria-label="Tabs">
              <button
                onClick={() => setMode('create')}
                className={`${
                  mode === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex-1`}
              >
                Create Job Description
              </button>
              <button
                onClick={() => setMode('compare')}
                className={`${
                  mode === 'compare'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex-1`}
              >
                Compare Job Descriptions
              </button>
            </nav>
          </div>

          <div className="p-6">
            {mode === 'create' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Key Responsibilities</label>
                  <textarea
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                    rows={5}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter each responsibility on a new line"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Required Qualifications</label>
                  <textarea
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    rows={5}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter each qualification on a new line"
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Generating...
                    </>
                  ) : (
                    'Generate Job Description'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={() => setUploadMethod('text')}
                    className={`flex-1 py-2 px-4 rounded-md ${
                      uploadMethod === 'text'
                        ? 'bg-blue-100 text-blue-700 border-blue-500'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    } border`}
                  >
                    <FileText className="inline-block w-4 h-4 mr-2" />
                    Paste Text
                  </button>
                  <button
                    onClick={() => setUploadMethod('file')}
                    className={`flex-1 py-2 px-4 rounded-md ${
                      uploadMethod === 'file'
                        ? 'bg-blue-100 text-blue-700 border-blue-500'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    } border`}
                  >
                    <Upload className="inline-block w-4 h-4 mr-2" />
                    Upload Files
                  </button>
                </div>

                {uploadMethod === 'text' ? (
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Job Description</label>
                      <textarea
                        value={jd1}
                        onChange={(e) => setJd1(e.target.value)}
                        rows={8}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Paste the first job description here"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Second Job Description</label>
                      <textarea
                        value={jd2}
                        onChange={(e) => setJd2(e.target.value)}
                        rows={8}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Paste the second job description here"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      {...dropzone1.getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                        dropzone1.isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      <input {...dropzone1.getInputProps()} />
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drag & drop first JD file here, or click to select
                      </p>
                      <p className="mt-1 text-xs text-gray-500">PDF, DOC, or DOCX</p>
                    </div>

                    <div
                      {...dropzone2.getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                        dropzone2.isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      <input {...dropzone2.getInputProps()} />
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drag & drop second JD file here, or click to select
                      </p>
                      <p className="mt-1 text-xs text-gray-500">PDF, DOC, or DOCX</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCompare}
                  disabled={loading || (!jd1 || !jd2)}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Comparing...
                    </>
                  ) : (
                    'Compare Job Descriptions'
                  )}
                </button>
              </div>
            )}

            {result && (
              <div className="mt-6">
                <div className="rounded-md bg-gray-50 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {mode === 'create' ? 'Generated Job Description' : 'Comparison Result'}
                    </h3>
                    <button
                      onClick={() => {
                        const element = document.createElement("a");
                        const file = new Blob([result], {type: 'text/plain'});
                        element.href = URL.createObjectURL(file);
                        element.download = `jd-${mode}-${new Date().toISOString().split('T')[0]}.txt`;
                        document.body.appendChild(element);
                        element.click();
                      }}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm text-
