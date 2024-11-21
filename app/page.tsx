'use client';
import React, { useState } from 'react';
import { Upload, Download, AlertCircle, Loader } from 'lucide-react';

type Notification = {
  type: 'success' | 'error';
  message: string;
} | null;

export default function Page() {
  // States
  const [mode, setMode] = useState<'create' | 'compare'>('create');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [notification, setNotification] = useState<Notification>(null);

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

  // File handling
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fileNumber: 1 | 2) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process file');

      const data = await response.json();
      if (fileNumber === 1) {
        setJd1(data.text);
        setUploadedFile1(file);
      } else {
        setJd2(data.text);
        setUploadedFile2(file);
      }
    } catch (error: any) {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to process file'
      });
    }
  };

  // Generate JD
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

      if (!response.ok) throw new Error('Failed to generate job description');

      const data = await response.json();
      setResult(data.jobDescription);
      setNotification({
        type: 'success',
        message: 'Job description generated successfully!'
      });
    } catch (error: any) {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to generate job description'
      });
    } finally {
      setLoading(false);
    }
  };

  // Compare JDs
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

      if (!response.ok) throw new Error('Failed to compare job descriptions');

      const data = await response.json();
      setResult(data.analysis);
      setNotification({
        type: 'success',
        message: 'Comparison completed successfully!'
      });
    } catch (error: any) {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to compare job descriptions'
      });
    } finally {
      setLoading(false);
    }
  };

  // Download result
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
    // ... UI code from previous response ...
  );
}
