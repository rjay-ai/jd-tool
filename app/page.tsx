'use client';
import React, { useState } from 'react';
import { LoadingSpinner, Notification } from '../components/ui-components';
import { Upload, Download, ArrowRight } from 'lucide-react';

type NotificationType = {
  type: 'success' | 'error';
  message: string;
} | null;

export default function Page() {
  // State declarations
  const [mode, setMode] = useState<'create' | 'compare'>('create');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [notification, setNotification] = useState<NotificationType>(null);
  const [isDragging, setIsDragging] = useState(false);

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
    setIsDragging(false);
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
        message: `File uploaded successfully: ${file.name}`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Failed to process file: ${file.name}`
      });
    }
  };

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
      {/* Header */}
      <div className="relative bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Job Description Tool
            </h1>
            <p className="text-lg text-gray-600">
              Create and compare professional job descriptions in seconds
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setMode('create')}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all
                ${mode === 'create' 
                  ? 'bg-white shadow text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'}`}
            >
              Create Job Description
            </button>
            <button
              onClick={() => setMode('compare')}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all
                ${mode === 'compare' 
                  ? 'bg-white shadow text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'}`}
            >
              Compare JDs
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {notification && (
          <div className="mb-6">
            <Notification type={notification.type} message={notification.message} />
          </div>
        )}
{/* Create Form */}
        {mode === 'create' && (
          <div className="max-w-3xl mx-auto mt-8">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-4 py-3 text-lg bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 text-lg bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Responsibilities
                  </label>
                  <textarea
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                    placeholder="Enter each responsibility on a new line"
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-medium text-base transition-all
                    ${loading 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  {loading ? <LoadingSpinner /> : 'Generate Job Description'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Compare Section */}
        {mode === 'compare' && (
          <div className="max-w-3xl mx-auto mt-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* First JD */}
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">First Job Description</h3>
                
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                      ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-500'}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
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
                        <div className="text-center">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mx-auto mb-2">
                            <ArrowRight className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="text-sm text-blue-600 font-medium">{uploadedFile1.name}</p>
                          <p className="text-xs text-gray-500 mt-1">Click to replace</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            <span className="text-blue-600 font-medium">Click to upload</span>
                            {' '}or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX</p>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Text Area */}
                  <div className="relative">
                    <textarea
                      value={jd1}
                      onChange={(e) => setJd1(e.target.value)}
                      placeholder="Or paste job description here"
                      rows={8}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
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
              </div>

              {/* Second JD */}
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Second Job Description</h3>
                
                <div className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                      ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-500'}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
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
                        <div className="text-center">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mx-auto mb-2">
                            <ArrowRight className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="text-sm text-blue-600 font-medium">{uploadedFile2.name}</p>
                          <p className="text-xs text-gray-500 mt-1">Click to replace</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            <span className="text-blue-600 font-medium">Click to upload</span>
                            {' '}or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX</p>
                        </>
                      )}
                    </label>
                  </div>

                  <div className="relative">
                    <textarea
                      value={jd2}
                      onChange={(e) => setJd2(e.target.value)}
                      placeholder="Or paste job description here"
                      rows={8}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                    {jd2 && (
                      <button
                        onClick={() => setJd2('')}
                        className="absolute top-2 right-2 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 bg-white rounded border shadow-sm"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCompare}
              disabled={loading || !jd1 || !jd2}
              className={`w-full mt-6 py-3 rounded-lg font-medium text-base transition-all
                ${loading || !jd1 || !jd2
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              {loading ? <LoadingSpinner /> : 'Compare Job Descriptions'}
            </button>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="mt-8">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {mode === 'create' ? 'Generated Job Description' : 'Comparison Results'}
                </h2>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Download
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
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
