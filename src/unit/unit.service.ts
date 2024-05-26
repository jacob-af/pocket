import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: object | null) {
    return await this.prisma.unit.findMany(options);
  }

  async findOne(unitAbb: string) {
    console.log(unitAbb);
    return await this.prisma.unit.findUnique({
      where: { abbreviation: unitAbb },
    });
  }
}