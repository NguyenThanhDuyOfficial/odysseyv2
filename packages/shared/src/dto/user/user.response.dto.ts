import { Role } from '@odyssey/database';

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string;
  display_name: string;
  role: Role;
  isActive: boolean;
  lastLoginAt: string;
  updatedAt: string;
  createdAt: string;
}
