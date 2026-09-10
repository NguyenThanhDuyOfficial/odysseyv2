import { UserResponseDTO } from '../user/response/user.dto';

export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponseDTO {
  user: UserResponseDTO;
  tokens: TokenResponseDto;
}

export interface RegisterResponseDTO {
  user: UserResponseDTO;
  tokens: TokenResponseDto;
}

export interface OAuthLoginResponseDTO {
  user: UserResponseDTO;
  tokens: TokenResponseDto;
  provider: string;
}
