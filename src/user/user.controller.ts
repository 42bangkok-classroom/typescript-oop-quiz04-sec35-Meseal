import { Controller, Get, Post, Param, Query, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('test')
  test() {
    return this.userService.test();
  }

  @Get()
  findAll(): IUser[] {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('fields') fields?: string,
  ) {
    const fieldArray = fields ? fields.split(',') : undefined;
    return this.userService.findOne(id, fieldArray);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createUserDto: CreateUserDto): IUser {
    return this.userService.create(createUserDto);
  }
}