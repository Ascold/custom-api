import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersRepositoryService {

  constructor(@InjectModel('User') private readonly userModel: Model<any>) {
  }

  public emailCheck(req) {
    return this.userModel.find({ email: req.body.email }).exec();
  }

  public passwordCheck(req, user): boolean {
    return bcrypt.compare(req.body.password, user[0].password);
  }

  public async getUsers() {
      this.userModel.find().exec();
      const usersArr = await this.userModel.find().exec();
      const result = [];
      usersArr.forEach(user => {
        const processedUser = {
          username: user.username,
          email: user.email,
        };
        result.push(processedUser);
      });
      return result;
  }

  public getUser(id) {
    return this.userModel.findById(id).exec();
  }

  public async createUser(req) {
    const user = await this.emailCheck(req);
    let salt;
    let hash;

    if (user.length >= 1) {
      throw new Error('mail_exists');
    }
    salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new this.userModel({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      password: hash,
      email: req.body.email,
    });
    const result = await newUser.save();
    return {
      username: result.username,
      password: result.password,
      email: result.email,
    };
  }

  public async loginUser(req) {
    const user = await this.emailCheck(req);

    if (user.length < 1) {
      throw new Error('auth_error');
    }
    const match = await this.passwordCheck(req, user);
    if (match) {
      const payload = {
        email: user[0].email,
      };
      return jwt.sign(payload, 'secret', { expiresIn: '7h' });
    }
  }
}
