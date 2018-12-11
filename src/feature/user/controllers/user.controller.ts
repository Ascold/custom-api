import {Controller, Get, HttpCode, HttpStatus, Post, Req, UseFilters, UseGuards} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDto } from '../dto/user.dto';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { AuthGuard } from '../../../core/guards/auth.guard';

@Controller('user')
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Req() request) {
    return await this.userService.createUser(request) as UserDto;
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    return await this.userService.getUsers() as Array<UserDto>;
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() request) {
    const token = await this.userService.loginUser(request);
    return {
      responsePayload: token,
      message: HttpStatus[HttpStatus.OK]
    };
  }
}
