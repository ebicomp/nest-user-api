// src/users/users.controller.ts
import { Controller, Post, Get, Param, Delete, Body, Res, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: any) {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':userId')
  getUser(@Param('userId') userId: string) {
    return this.usersService.findUserById(userId);
  }

  @Get(':userId/avatar')
  async getUserAvatar(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const avatarBase64 = await this.usersService.getUserAvatar(userId);
      res.send(avatarBase64);
    } catch (error) {
      throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':userId/avatar')
  async deleteUserAvatar(@Param('userId') userId: string, @Res() res: Response) {
    try {
      await this.usersService.deleteUserAvatar(userId);
      res.status(HttpStatus.OK).json({ message: 'Avatar deleted successfully' });
    } catch (error) {
      throw new HttpException('Failed to delete avatar', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
