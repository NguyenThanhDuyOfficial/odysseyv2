import { postRepository } from '@odyssey/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = await params;
  const response = await postRepository.findBySlug(slug);
  console.log(response);
  return NextResponse.json(response);
}
