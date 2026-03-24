import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  private readonly filePath = path.join(process.cwd(), 'data', 'users.json');

  private readDatabase(): IUser[] {
    try {
      const rawData = fs.readFileSync(this.filePath, 'utf8');
      // แปลงเป็น unknown ก่อน เพื่อป้องกัน Unsafe Assignment ของ ESLint
      const parsedData = JSON.parse(rawData) as unknown;
      return parsedData as IUser[];
    } catch {
      // ลบตัวแปร error ออก เพราะกฎไม่ให้มีตัวแปรที่ประกาศแล้วไม่ได้ใช้
      return [];
    }
  }

  // เปลี่ยนจาก any[] เป็น never[] (เพราะคืนค่า Array ว่างเสมอ)
  test(): never[] {
    return [];
  }

  findAll(): IUser[] {
    return this.readDatabase();
  }

  findOne(id: string, fields?: string[]): Partial<IUser> {
    const users = this.readDatabase();
    const user = users.find((u) => u.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!fields || fields.length === 0) {
      return user;
    }

    // เปลี่ยนจาก reduce มาใช้ for...of และ keyof เพื่อให้ Type Safe 100%
    const result: Partial<IUser> = {};
    for (const field of fields) {
      const key = field as keyof IUser;
      if (user[key] !== undefined) {
        result[key] = user[key];
      }
    }

    return result;
  }

  create(dto: CreateUserDto): IUser {
    const users = this.readDatabase();

    const lastId =
      users.length > 0
        ? Math.max(...users.map((u) => parseInt(u.id, 10))) // ใส่ radix 10 ให้ parseInt
        : 0;
    const newId = (lastId + 1).toString();

    const newUser: IUser = {
      id: newId,
      ...dto,
    };

    users.push(newUser);
    fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2), 'utf8');

    return newUser;
  }
}
