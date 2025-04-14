import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAggregator } from '../../aggregators/user/user.service';
import { SignupDto, SignupResponseDto } from './dto/signup.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { createHash } from 'crypto';

@Injectable()
export class AuthSystem {
  constructor(
    private readonly userAggregator: UserAggregator,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<SignupResponseDto> {
    try {
      const hashedPassword = createHash('sha256')
        .update(dto.password)
        .digest('hex');

      const user = await this.userAggregator.createUser({
        email: dto.email,
        password: hashedPassword,
      });

      const token = this.jwtService.sign({ userId: user.id });

      return {
        token,
        email: user.email,
      };
    } catch (error) {
      console.error('Failed to sign up', error);
      throw new Error('Failed to sign up');
    }
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userAggregator.getUserByEmail({
      email: dto.email,
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const hashedPassword = createHash('sha256')
      .update(dto.password)
      .digest('hex');
    const isPasswordValid = hashedPassword === user.password;
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user.id });

    return {
      token,
      email: user.email,
    };
  }
}
