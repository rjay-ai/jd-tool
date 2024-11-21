// app/api/generate/route.ts
import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { jobTitle, department, responsibilities, qualifications } = await req.json();

    if (!jobTitle || !department || !responsibilities || !qualifications) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Create a professional job description:

Title: ${jobTitle}
Department: ${department}
Key Responsibilities:
${responsibilities}

Required Qualifications:
${qualifications}

Format with sections:
1. Overview (2-3 sentences)
2. Responsibilities (bullet points)
3. Required Qualifications (bullet points)
4. Preferred Qualifications 
5. Additional Info (work type, reporting structure)`
      }]
    });

    return NextResponse.json({ 
      jobDescription: response.content[0].text 
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate job description' },
      { status: 500 }
    );
  }
}
