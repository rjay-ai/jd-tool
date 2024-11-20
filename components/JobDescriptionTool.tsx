'use client';
import React, { useState } from 'react';

export default function JobDescriptionTool() {
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          department,
          responsibilities,
          qualifications,
        }),
      });
      
      const data = await response.json();
      setResult(data.jobDescription);
    } catch (error) {
      console.error('Error:', error);
      setResult('Failed to generate job description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jd1, jd2 }),
      });
      
      const data = await response.json();
      setResult(data.analysis);
    } catch (error) {
      console.error('Error:', error);
      setResult('Failed to compare job descriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${mode === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setMode('create')}
          >
            Create JD
          </button>
          <button
            className={`px-4 py-2 rounded ${mode === 'compare' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setMode('compare')}
          >
            Compare JDs
          </button>
        </div>
      </div>

      {mode === 'create' ? (
        <div className="space-y-4">
          <input
            className="w-full p-2 border rounded"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Job Title"
          />
          <input
            className="w-full p-2 border rounded"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Department"
          />
          <textarea
            className="w-full p-2 border rounded"
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            placeholder="Key Responsibilities (one per line)"
            rows={5}
          />
          <textarea
            className="w-full p-2 border rounded"
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            placeholder="Required Qualifications (one per line)"
            rows={5}
          />
          <button
            className={`w-full p-2 rounded text-white ${loading ? 'bg-gray-500' : 'bg-blue-500'}`}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Job Description'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            className="w-full p-2 border rounded"
            value={jd1}
            onChange={(e) => setJd1(e.target.value)}
            placeholder="Paste first job description"
            rows={8}
          />
          <textarea
            className="w-full p-2 border rounded"
            value={jd2}
            onChange={(e) => setJd2(e.target.value)}
            placeholder="Paste second job description"
            rows={8}
          />
          <button
            className={`w-full p-2 rounded text-white ${loading ? 'bg-gray-500' : 'bg-blue-500'}`}
            onClick={handleCompare}
            disabled={loading}
          >
            {loading ? 'Comparing...' : 'Compare Job Descriptions'}
          </button>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
