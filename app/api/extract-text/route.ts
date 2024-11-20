// app/api/extract-text/route.ts
import { NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const arrayBuffer = await file.arrayBuffer();

    let text = '';
    const fileType = file.type;

    if (fileType === 'application/pdf') {
      // Handle PDF
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdfDoc.numPages;
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               fileType === 'application/msword') {
      // Handle DOCX/DOC
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
    } else {
      throw new Error('Unsupported file type');
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to extract text' },
      { status: 500 }
    );
  }
}
