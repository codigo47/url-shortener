import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      if (!secret) {
        throw new Error('JWT_SECRET is not configured');
      }

      const decoded = verify(token, secret) as {
        userId: number;
      };

      // Add the decoded user to the request for use in resolvers
      req.user = decoded;

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        `Invalid or expired token: ${error.message}`,
      );
    }
  }
}
