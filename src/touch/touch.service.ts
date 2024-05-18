import { ArchivedTouch, TouchInput } from '../graphql';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TouchService {
  constructor(private prisma: PrismaService) {}

  create() {
    return 'This action adds a new touch';
  }

  async touch(buildId: string) {
    return await this.prisma.touch.findMany({
      where: { buildId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    return await this.prisma.touch.findUnique({ where: { id: id } });
  }

  update() {
    return `This action updates a #$ touch`;
  }

  remove() {
    return `This action removes a  touch`;
  }

  async createTouchArray(
    buildId: string,
    touchArray: TouchInput[],
    version: number,
  ) {
    const newTouchArray = touchArray.map(async (touch, index) => {
      const newTouch = await this.prisma.touch.create({
        data: {
          build: { connect: { id: buildId } },
          order: index,
          ingredient: { connect: { name: touch.ingredientName } },
          amount: touch.amount,
          unit: touch.unit,
          version,
        },
      });
      return newTouch;
    });
    return newTouchArray;
  }

  touchArrayWithIndex(touchArray: TouchInput[], version: number) {
    return touchArray.map((touch, index) => {
      return {
        order: index,
        ingredient: {
          connectOrCreate: {
            where: { name: touch.ingredientName },
            create: { name: touch.ingredientName },
          },
        },
        amount: touch.amount,
        unit: touch.unit,
        version,
      };
    });
  }

  async archiveTouchArray(buildId, version) {
    const touchToArchive = await this.prisma.touch.findMany({
      where: {
        buildId,
        version,
      },
    });

    const archivedTouchArray: Promise<ArchivedTouch>[] = touchToArchive.map(
      async (touch, index: number) => {
        return await this.prisma.archivedTouch.create({
          data: {
            archivedBuild: { connect: { id: buildId } },
            order: index,
            ingredient: { connect: { name: touch.ingredientName } },
            amount: touch.amount,
            unit: touch.unit,
            version,
          },
        });
      },
    );

    const deletedArray = touchToArchive.map(async (touch) => {
      return this.prisma.touch.delete({
        where: { id: touch.id },
      });
    });
    console.log(deletedArray);
    return archivedTouchArray;
  }
}
