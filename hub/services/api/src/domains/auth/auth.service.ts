import type { FastifyInstance } from 'fastify';
import type { RegisterDTO, LoginDTO } from '@tupynambalucas-hub/core';
import type { IAuthRepository } from './auth.repository.interface.js';
import type { IUserDocument } from '../../models/user.model.js';
import { AppError } from '../../utils/AppError.js';

interface LoginResponse {
  user: IUserDocument;
  token: string;
}

export class AuthService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCK_TIME = 15 * 60 * 1000; // 15 minutes

  constructor(
    private readonly authRepo: IAuthRepository,
    private readonly server: FastifyInstance,
  ) {}

  private async verifyTurnstile(token: string, ip?: string): Promise<void> {
    const secret = this.server.config.TURNSTILE_SECRET_KEY;

    try {
      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret,
          response: token,
          remoteip: ip,
        }),
      });

      const result = (await response.json()) as { success: boolean };

      if (!result.success) {
        throw new AppError('BOT_DETECTION_FAILED', 403);
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
      this.server.log.error(err, 'Turnstile verification error');
      throw new AppError('BOT_DETECTION_ERROR', 500);
    }
  }

  public async register(data: RegisterDTO, ip?: string): Promise<IUserDocument> {
    await this.verifyTurnstile(data.turnstileToken, ip);

    const existingUser = await this.authRepo.findByEmailOrUsername(data.email, data.username);

    if (existingUser) {
      const code =
        existingUser.email === data.email ? 'EMAIL_ALREADY_EXISTS' : 'USERNAME_ALREADY_EXISTS';
      throw new AppError(code, 409);
    }

    return this.authRepo.create(data);
  }

  public async login(data: LoginDTO, ip?: string): Promise<LoginResponse> {
    await this.verifyTurnstile(data.turnstileToken, ip);

    const user = await this.authRepo.findByIdentifier(data.identifier);

    // Generic error for obfuscation
    const genericError = new AppError('INVALID_CREDENTIALS', 401);

    if (!user) {
      throw genericError;
    }

    // Check if account is locked
    if (user.isLocked) {
      throw new AppError('ACCOUNT_LOCKED', 423);
    }

    if (!user.password) {
      throw genericError;
    }

    const isValid = await this.server.compareHash(data.password, user.password);

    if (!isValid || isValid instanceof Error) {
      // Increment attempts
      user.loginAttempts += 1;

      if (user.loginAttempts >= this.MAX_ATTEMPTS) {
        user.lockUntil = Date.now() + this.LOCK_TIME;
      }

      await user.save();
      throw genericError;
    }

    // Reset attempts on successful login
    if (user.loginAttempts > 0 || user.lockUntil) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();
    }

    const token = this.server.jwt.sign(
      {
        _id: String(user._id),
        email: user.email,
        username: user.username,
        role: user.role,
        icon: user.icon,
      },
      {
        algorithm: 'HS256', // Force symmetric HS256 (Security mitigation)
      },
    );

    return { user, token };
  }

  public async validateUser(id: string): Promise<IUserDocument | null> {
    return this.authRepo.findById(id);
  }
}
