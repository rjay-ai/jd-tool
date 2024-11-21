// app/api/extract-text/route.ts
import { NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    let text = '';

    if (file.type === 'application/pdf') {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items
          .map((item: any) => item.str)
          .join(' ') + '\n';
      }
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
    } else {
      throw new Error('Unsupported file type. Please upload PDF or DOC/DOCX files.');
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Text extraction error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to extract text from file' },
      { status: 500 }
    );
  }
}
