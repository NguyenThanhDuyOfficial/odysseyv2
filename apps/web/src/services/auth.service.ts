import { providerRepository, userRepository } from '@odyssey/database';
import {
  AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
} from '@odyssey/error-handling';
import {
  LoginDTO,
  LoginResponseDTO,
  RegisterDTO,
  RegisterResponseDTO,
  TokenResponseDto,
} from '@odyssey/shared';
import { compare, hash } from 'bcrypt';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_SECRET_EXPIRES_IN = 15 * 60 * 1000;
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_REFERSH_SECRET_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000;

function generateTokens(
  userId: string,
  email: string | null,
  role: string | null,
): TokenResponseDto {
  const accessToken = sign(
    { userId, email, role, type: 'access' },
    JWT_SECRET,
    { expiresIn: JWT_SECRET_EXPIRES_IN },
  );

  const refreshToken = sign({ userId, type: 'refresh' }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFERSH_SECRET_EXPIRES_IN,
  });

  return { accessToken, refreshToken, expiresIn: JWT_SECRET_EXPIRES_IN };
}

function verifyAccessToken(token: string) {
  try {
    const decoded = verify(token, JWT_SECRET) as JwtPayload & {
      userId: number;
      type: string;
    };

    if (decoded.type !== 'access') {
      throw new BadRequestError('INVALID_TOKEN');
    }

    return decoded;
  } catch (error) {
    throw new UnauthorizedError('INVALID_OR_EXPIRED_TOKEN');
  }
}

function verifyRefreshToken(token: string) {
  try {
    const decoded = verify(token, JWT_REFRESH_SECRET) as JwtPayload & {
      userId: number;
      type: string;
    };

    if (decoded.type !== 'refresh') {
      throw new BadRequestError('INVALID_TOKEN');
    }

    return decoded;
  } catch (error) {
    throw new UnauthorizedError('INVALID_OR_EXPIRED_TOKEN');
  }
}

export class AuthService {
  async register(data: RegisterDTO): Promise<RegisterResponseDTO> {
    const existing = await userRepository.findByEmail(data.email);

    if (existing) {
      throw new ConflictError('EMAIL_ALREADY_REGISTERED');
    }

    const hashedPassword = await hash(data.password, 10);

    const user = await userRepository.create(data);

    const tokens = generateTokens(user.id, user.email, user.role);

    await providerRepository.create({
      userId: user.id,
      provider: 'email',
      email: user.email,
      hashedPassword: hashedPassword,
      refreshToken: tokens.refreshToken,
      tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      user,
      tokens,
    };
  }

  async login(data: LoginDTO): Promise<LoginResponseDTO> {
    const provider = await providerRepository.findWithPassword(data.email);
    if (!provider) {
      throw new UnauthorizedError('INVALID_EMAIL_OR_PASSWORD');
    }
    const isValid = await compare(data.password, provider.hashedPassword!);
    if (!isValid) {
      throw new UnauthorizedError('INVALID_EMAIL_OR_PASSWORD');
    }

    const user = await userRepository.findById(provider.userId);
    if (!user) {
      throw new AppError('ACCOUNT_DATA_INCONSISTENCY');
    }
    if (!user!.isActive) {
      throw new ForbiddenError('ACCOUNT_IS_DISABLED');
    }

    const tokens = generateTokens(provider.userId, provider.email, user!.role);

    await providerRepository.update(provider.id, {
      refreshToken: tokens.refreshToken,
      tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
    await userRepository.update(user!.id, {
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      user,
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
    const decoded = verifyRefreshToken(refreshToken);

    const provider = await providerRepository.findWithPassword(decoded.email);
    if (!provider || !provider.tokenExpiresAt || !provider.refreshToken) {
      throw new BadRequestError('INVALID_TOKEN');
    }

    if (new Date() > provider.tokenExpiresAt) {
      await this.revokeRefreshToken(provider.id);
      throw new UnauthorizedError('EXPIRED_TOKEN');
    }

    const user = await userRepository.findById(provider.userId);

    if (!user || !user.isActive) {
      throw new ForbiddenError('ACCOUNT_IS_DISABLED');
    }

    await this.revokeRefreshToken(provider.id);

    const tokens = generateTokens(user.id, user.email, user.role);

    await providerRepository.update(provider.id, {
      refreshToken: tokens.refreshToken,
      tokenExpiresAt: new Date(Date.now() + JWT_REFERSH_SECRET_EXPIRES_IN),
    });

    return tokens;
  }
  async logout(providerId: string) {
    await this.revokeRefreshToken(providerId);
  }

  async getUserFromToken(token: string) {
    return verifyAccessToken(token);
  }

  async revokeRefreshToken(providerId: string) {
    await providerRepository.update(providerId, { refreshToken: null });
  }
}
export const authService = new AuthService();
