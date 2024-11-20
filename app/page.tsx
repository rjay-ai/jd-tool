'use client';
import React, { useState } from 'react';

export default function Home() {
  const [mode, setMode] = useState('create');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  // Create JD states
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [qualifications, setQualifications] = useState('');

  // Compare JD states
  const [jd1, setJd1] = useState('');
  const [jd2, setJd2] = useState('');

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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Job Description Tool</h1>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('create')}
            className={`flex-1 py-2 px-4 rounded ${
              mode === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Create JD
          </button>
          <button
            onClick={() => setMode('compare')}
            className={`flex-1 py-2 px-4 rounded ${
              mode === 'compare' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Compare JDs
          </button>
        </div>

        {mode === 'create' ? (
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Key Responsibilities (one per line)"
              rows={5}
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
            />
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Required Qualifications (one per line)"
              rows={5}
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full p-2 rounded text-white ${
                loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Job Description'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Paste first job description"
              rows={8}
              value={jd1}
              onChange={(e) => setJd1(e.target.value)}
            />
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Paste second job description"
              rows={8}
              value={jd2}
              onChange={(e) => setJd2(e.target.value)}
            />
            <button
              onClick={handleCompare}
              disabled={loading}
              className={`w-full p-2 rounded text-white ${
                loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? 'Comparing...' : 'Compare Job Descriptions'}
            </button>
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
