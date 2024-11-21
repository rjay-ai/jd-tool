// app/api/compare/route.ts
import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { jd1, jd2 } = await req.json();

    if (!jd1 || !jd2) {
      return NextResponse.json(
        { error: 'Both job descriptions are required' },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Compare these two job descriptions and provide a detailed analysis:

Job Description 1:
${jd1}

Job Description 2:
${jd2}

Please analyze and compare:
1. Key responsibilities overlap
2. Required skills and qualifications comparison
3. Level/seniority comparison
4. Unique aspects of each role
5. Overall assessment of which role is more senior and why

Format the response clearly with sections and bullet points.`
      }]
    });

    return NextResponse.json({
      analysis: response.content[0].text
    });
  } catch (error) {
    console.error('Comparison error:', error);
    return NextResponse.json(
      { error: 'Failed to compare job descriptions' },
      { status: 500 }
    );
  }
}
