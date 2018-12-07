import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin@node-test-shard-00-00-uamiy.mongodb.net:27017,node-test-shard-00-01-uamiy.mongodb.net:27017,node-test-shard-00-02-uamiy.mongodb.net:27017/test?ssl=true&replicaSet=node-test-shard-0&authSource=admin&retryWrites=true'),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
