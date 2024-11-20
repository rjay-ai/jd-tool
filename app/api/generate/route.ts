import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { jobTitle, department, responsibilities, qualifications } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Create a professional job description for:
          Title: ${jobTitle}
          Department: ${department}
          Responsibilities: ${responsibilities}
          Qualifications: ${qualifications}
          
          Format it professionally with sections for Overview, Responsibilities, Required Qualifications, and Additional Information.`
      }]
    });

    return NextResponse.json({ 
      jobDescription: response.content[0].text
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
  }
}
