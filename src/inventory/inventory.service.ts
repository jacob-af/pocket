import { Injectable } from '@nestjs/common';
import { Permission } from 'src/graphql';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.inventory.findMany();
  }

  async findOne(inventoryId: string) {
    return await this.prisma.inventory.findUnique({
      where: { id: inventoryId },
    });
  }

  async create(name: string, description: string, userId) {
    return await this.prisma.inventory.create({
      data: { name, description, createdById: userId, editedById: userId },
    });
  }

  async changePermission(
    inventoryId: string,
    userId: string,
    permission: Permission,
  ) {
    const stockUser = await this.prisma.inventoryUser.upsert({
      where: { userId_inventoryId: { inventoryId, userId } },
      update: { permission },
      create: { inventoryId, userId, permission },
    });
    return stockUser.permission;
  }
}