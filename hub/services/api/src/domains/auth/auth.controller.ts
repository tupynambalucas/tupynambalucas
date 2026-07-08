import type { FastifyZodHandler } from '../../types/fastify.js';
import type { AuthService } from './auth.service.js';
import type { RegisterRoute, LoginRoute } from './auth.schema.js';
import type { IUserDocument } from '../../models/user.model.js';
import { AppError } from '../../utils/AppError.js';

interface MapUserResponse {
  _id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserPlainObject {
  _id: { toString(): string };
  email: string;
  username: string;
  role: string;
  icon: string;
  createdAt?: Date | string | number;
  updatedAt?: Date | string | number;
}

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private mapUserResponse(user: IUserDocument): MapUserResponse {
    const obj = user.toObject() as UserPlainObject;

    return {
      _id: obj._id.toString(),
      email: obj.email,
      username: obj.username,
      role: obj.role as 'user' | 'admin',
      icon: obj.icon,
      createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : undefined,
      updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : undefined,
    };
  }

  public registerHandler: FastifyZodHandler<RegisterRoute> = async (req, reply): Promise<void> => {
    await this.authService.register(req.body, req.ip);
    void reply.status(201).send({ message: 'USER_CREATED_SUCCESSFULLY' });
  };

  public loginHandler: FastifyZodHandler<LoginRoute> = async (req, reply): Promise<void> => {
    const result = await this.authService.login(req.body, req.ip);

    req.session.token = result.token;

    void reply.send({
      authenticated: true,
      token: result.token,
      user: this.mapUserResponse(result.user),
    });
  };

  public logoutHandler: FastifyZodHandler<Record<string, never>> = async (
    req,
    reply,
  ): Promise<void> => {
    await req.session.destroy();
    void reply.send({ message: 'LOGOUT_SUCCESSFUL' });
  };

  public verifyHandler: FastifyZodHandler<Record<string, never>> = async (
    req,
    reply,
  ): Promise<void> => {
    const user = await this.authService.validateUser(req.user._id);

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 401);
    }

    void reply.send({
      authenticated: true,
      user: this.mapUserResponse(user),
    });
  };
}
