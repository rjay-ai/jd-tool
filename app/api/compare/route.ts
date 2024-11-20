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
          content: `Compare these two job descriptions and provide a detailed analysis of:
            1. Key overlapping responsibilities and requirements
            2. Unique elements in each JD
            3. Grade level comparison
            4. Suggested level for each role
            
            JD 1:
            ${jd1}

            JD 2:
            ${jd2}`
        }]
      })
    });

    const data = await response.json();
    return NextResponse.json({ analysis: data.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to compare descriptions' }, { status: 500 });
  }
}
