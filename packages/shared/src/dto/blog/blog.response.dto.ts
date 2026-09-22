import { PostStatus } from '@odyssey/database';
import { UserDTO } from '../user/user.response.dto';

export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface BlogsResponseDTO {
  data: BlogDTO[];
  pagination: PaginationDTO;
}

export interface BlogDTO {
  posts: PostDTO;
  users: UserDTO;
}

export interface PostDTO {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  status: PostStatus;
  viewCount: number | null;
  voteCount: number | null;
  publishedAt: Date | null;
  authorId: string;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}
