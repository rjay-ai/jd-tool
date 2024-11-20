import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { jobTitle, department, responsibilities, qualifications } = await req.json();
    
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
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
      })
    });

    const data = await response.json();
    return NextResponse.json({ jobDescription: data.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
  }
}
