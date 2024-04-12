import { Module } from '@nestjs/common';
import { TouchService } from './touch.service';
import { TouchResolver } from './touch.resolver';
import { BuildService } from '../build/build.service';
import { IngredientService } from 'src/ingredient/ingredient.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [
    TouchResolver,
    TouchService,
    BuildService,
    IngredientService,
    PrismaService,
  ],
})
export class TouchModule {}