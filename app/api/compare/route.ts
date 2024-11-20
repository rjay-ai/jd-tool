import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { jd1, jd2 } = await req.json();
    
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
        max_tokens: 1500,
        messages: [{
          role: "user",
          content: `Compare these two job descriptions and provide a detailed analysis:

1. Key Similarities:
   - Responsibilities overlap
   - Required skills and qualifications
   - Experience level
   
2. Key Differences:
   - Unique responsibilities
   - Different skill requirements
   - Seniority level differences
   
3. Level Assessment:
   - Compare seniority levels
   - Suggest appropriate grade
   
First JD:
${jd1}

Second JD:
${jd2}

Please provide a structured analysis with clear sections and bullet points.`
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to compare JDs');
    }

    const data = await response.json();
    return NextResponse.json({ 
      analysis: data.content[0].text 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to compare job descriptions. Please try again.' },
      { status: 500 }
    );
  }
}
