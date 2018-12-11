import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepositoryService {

  constructor(@InjectModel('User') private readonly userModel) {
  }

  public async getUserByMail(req): Promise<Array<any>> {
    return await this.userModel.find({ email: req.body.email }).exec();
  }

  public getUsers(): Array<any> {
      return  this.userModel.find().exec();
  }

  public getUser(id) {
    return this.userModel.findById(id).exec();
  }

  public async createUser(req): Promise<any> {
    const user = await this.getUserByMail(req);
    let salt;
    let hash;

    if (user.length >= 1) {
      throw new HttpException(HttpStatus[HttpStatus.CONFLICT], HttpStatus.CONFLICT);
    }

    salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new this.userModel({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      password: hash,
      email: req.body.email,
    });
    return await newUser.save();
  }

  public async loginUser(req) {

    const user = await this.getUserByMail(req);

    if (user.length < 1) {
      throw new HttpException(HttpStatus[HttpStatus.UNAUTHORIZED], HttpStatus.UNAUTHORIZED);
    }
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) {
      throw new HttpException(HttpStatus[HttpStatus.FORBIDDEN], HttpStatus.FORBIDDEN);
    }
    return user[0];
  }
}
