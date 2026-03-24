import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  private readonly filePath = path.join(process.cwd(), 'data', 'users.json');

  // Helper สำหรับอ่านไฟล์ JSON
  private readDatabase(): IUser[] {
    try {
      const rawData = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(rawData);
    } catch (error) {
      return []; // ถ้าไฟล์ไม่มีหรืออ่านไม่ได้ ให้คืนค่า Array ว่าง
    }
  }

  test(): any[] {
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

    // กรองเอาเฉพาะ fields ที่ระบุ
    return fields.reduce((obj, field) => {
      if (user[field] !== undefined) {
        obj[field] = user[field];
      }
      return obj;
    }, {});
  }

  create(dto: CreateUserDto): IUser {
    const users = this.readDatabase();

    // Generate ID: หา ID สูงสุดแล้วบวก 1
    const lastId = users.length > 0 
      ? Math.max(...users.map(u => parseInt(u.id))) 
      : 0;
    const newId = (lastId + 1).toString();

    const newUser: IUser = {
      id: newId,
      ...dto,
    };

    users.push(newUser);

    // บันทึกข้อมูลลงไฟล์
    fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2), 'utf8');

    return newUser;
  }
}