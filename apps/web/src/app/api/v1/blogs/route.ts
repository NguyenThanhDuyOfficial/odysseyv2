import { postRepository } from '@odyssey/database';
import { NextResponse } from 'next/server';
export async function GET() {
  const response = await postRepository.findMany();
  return NextResponse.json(response);
}
