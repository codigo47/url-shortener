import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import {
  GetUserByEmailDto,
  GetUserByEmailResponseDto,
} from './dto/get-user.dto';

@Injectable()
export class UserAggregator {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.password,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return user;
  }

  async getUserByEmail({
    email,
  }: GetUserByEmailDto): Promise<GetUserByEmailResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    return user;
  }
}
