import { postRepository } from '@odyssey/database';
import { NextRequest, NextResponse } from 'next/server';
export async function GET() {
  const response = await postRepository.findMany();
  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, content, authorId, status, excerpt } = body;

  const slug = title
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  const response = await postRepository.create({
    title,
    slug,
    content,
    authorId,
    excerpt,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: authorId,
    publishedAt: new Date(),
    status,
  });

  return NextResponse.json(response);
}
