// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import axios from 'axios';
// import { RabbitMQService } from '../rabbitmq.service';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    // private rabbitMQService: RabbitMQService,
  ) {}

  async createUser(createUserDto: any): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();

    // --------------- here I should use the rabbitMQ service
    // this.rabbitMQService.publish('user.created', { user: createUserDto });
    return createdUser;
  }

  async findUserById(userId: string): Promise<User> {
    const response = await axios.get(`https://reqres.in/api/users/${userId}`);
    return response.data.data;
  }

  async getUserAvatar(userId: string): Promise<string> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');

    if (user.avatar && fs.existsSync(path.resolve(`./avatars/${userId}.png`))) {
      return fs.promises.readFile(path.resolve(`./avatars/${userId}.png`), { encoding: 'base64' });
    } else {
      const response = await axios.get(user.avatar, { responseType: 'arraybuffer' });
      const data = Buffer.from(response.data, 'binary').toString('base64');
      await writeFile(path.resolve(`./avatars/${userId}.png`), response.data);

      user.avatar = data;
      await user.save();
      
      return data;
    }
  }

  async deleteUserAvatar(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user || !user.avatar) throw new Error('User or avatar not found');

    const filePath = path.resolve(`./avatars/${userId}.png`);
    if (fs.existsSync(filePath)) {
      await unlink(filePath);
    }

    // Clear the avatar field in DB
    user.avatar = null;
    await user.save();
  }
}
