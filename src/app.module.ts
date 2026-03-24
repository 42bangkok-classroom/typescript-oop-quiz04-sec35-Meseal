import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [],
  controllers: [AppController, UserController], // เพิ่ม UserController
  providers: [AppService, UserService], // เพิ่ม UserService
})
export class AppModule {}
