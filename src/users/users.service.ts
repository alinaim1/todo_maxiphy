/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpResponse } from './user';
import { CreateUserDto } from './create-user-dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';
import { LoginUserDto } from './login-dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './update-user-dto';
import { DeleteUserDto } from './delete-user-dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async createUser(
    payload: CreateUserDto,
  ): Promise<SignUpResponse & { access_token: string }> {
    // Use findFirst for unique fields
    const email_exist = await this.prisma.user.findFirst({
      where: {
        email: payload.email,
      },
    });
    if (email_exist) {
      throw new ConflictException({
        statusCode: 409,
        message: 'Email already exists',
        error: 'Conflict',
      });
    }
    const hashedPassword = await this.encryptPassword(payload.password, 10);
    payload.password = hashedPassword;
    try {
      const createuser = await this.prisma.user.create({
        data: payload,
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      if (!createuser) {
        throw new InternalServerErrorException('User creation failed');
      }
      const token = await this.jwtService.signAsync(
        { id: createuser.id, email: createuser.email, name: createuser.name },
        { expiresIn: '1d' },
      );
      return { ...createuser, access_token: token };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException({
          statusCode: 409,
          message: 'Email already exists',
          error: 'Conflict',
        });
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
  async loginUser(
    loginUserDto: LoginUserDto,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findFirst({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (
      !user ||
      !(await bcrypt.compare(loginUserDto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = await this.jwtService.signAsync(
      { id: user.id, email: user.email, name: user.name },
      { expiresIn: '1d' },
    );
    return { access_token: token };
  }
  async updateUser(payload: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: payload.id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${payload.id} not found`);
    }
    if (payload.password) {
      payload.password = await this.encryptPassword(payload.password, 10);
    }
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: payload.id },
        data: payload,
      });
      if (!updatedUser) {
        throw new InternalServerErrorException('User update failed');
      }
      return { message: 'User updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUser(payload: DeleteUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: payload.id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${payload.id} not found`);
    }
    const todo = await this.prisma.todo.findFirst({
      where: { userId: payload.id },
    });
    if (todo) {
      throw new ConflictException(
        'User has associated todos and cannot be deleted',
      );
    }
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id: payload.id },
      });
      if (!deletedUser) {
        throw new InternalServerErrorException('User deletion failed');
      }
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async encryptPassword(plainTextPassword: string, saltRounds: number) {
    return await bcrypt.hash(plainTextPassword, saltRounds);
  }
}
