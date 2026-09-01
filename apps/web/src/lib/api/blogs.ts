import { BlogsResponnseDTO } from '@odyssey/shared';
import { httpClient } from '../httpClient';

export async function fetchBlogs(): Promise<BlogsResponnseDTO> {
  if (typeof window === 'undefined') {
    return {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }
  const response = await httpClient.get<BlogsResponnseDTO>('/blogs');
  return response;
}

export async function createBlog({
  title,
  content,
  status = 'published',
  authorId,
}: {
  title: string;
  content: string;
  status?: string;
  authorId: string;
}) {
  const response = await httpClient.post('/blogs', {
    title,
    content,
    status,
    authorId,
  });
  return response;
}
