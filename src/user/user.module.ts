import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './controllers/user.controller';

import { UserService } from './services/user.service';
import { UsersRepositoryService } from './repository/users-repository.service';

import { userSchema } from './models/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
  controllers: [UserController],
  providers: [UserService, UsersRepositoryService],
})
export class UserModule {}
