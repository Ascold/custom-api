import { Controller, Get, Post, Req } from '@nestjs/common';

import { UserService } from '../services/user.service';
import { UsersRepositoryService } from '../repository/users-repository.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService,
              private usersRepository: UsersRepositoryService) {}

  @Post()
  async create(@Req() request) {
    const result = await this.usersRepository.createUser(request);
    return {
      username: result.username,
      password: result.password,
      email: result.email,
    };
  }

  @Get()
  async findAll() {
    return 'get res';
  }
}
