import { Post, postRepository } from '@odyssey/database';
import { PostDTO } from '@odyssey/shared';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
): Promise<NextResponse<PostDTO>> {
  const { slug } = await params;
  const data = await postRepository.findBySlug(slug);
  const response = toBlogDTO(data);
  return NextResponse.json(response);
}

function toBlogDTO(post: Post): PostDTO {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featuredImageUrl: post.featuredImageUrl,
    status: post.status,
    viewCount: post.viewCount,
    voteCount: post.voteCount,
    publishedAt: post.publishedAt,
    authorId: post.authorId,
    updatedBy: post.updatedBy,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}
