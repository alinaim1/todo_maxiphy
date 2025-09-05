import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './create-user-dto';
import { UsersService } from './users.service';
import { LoginUserDto } from './login-dto';
import { AuthGuard } from './auth.guard';
import { UpdateUserDto } from './update-user-dto';
import { DeleteUserDto } from './delete-user-dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  async create(@Body() createUserDto: CreateUserDto) {
    //name, email, password,CreateAt automation
    return await this.usersService.createUser(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.usersService.loginUser(loginUserDto);
  }
  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Request() req: { user: any }): any {
    return req.user;
  }

  @Put('/update')
  @UseGuards(AuthGuard)
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto);
  }

  @Delete('/delete')
  @UseGuards(AuthGuard)
  async deleteUser(@Body() deleteUserdto: DeleteUserDto) {
    return this.usersService.deleteUser(deleteUserdto);
  }

  @Get()
  findAll(): string {
    return 'This action returns all users';
  }
}
