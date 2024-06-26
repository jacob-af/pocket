import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DateTimeResolver, EmailAddressResolver } from 'graphql-scalars';

import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/accessToken.guard';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from './auth/auth.module';
import { BuildModule } from './build/build.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { IngredientModule } from './ingredient/ingredient.module';
import { InventoryModule } from './inventory/inventory.module';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ProfileModule } from './profile/profile.module';
import { RecipeBookModule } from './recipe-book/recipe-book.module';
import { RecipeModule } from './recipe/recipe.module';
import { StockModule } from './stock/stock.module';
import { TouchModule } from './touch/touch.module';
import { UnitModule } from './unit/unit.module';
import { UserModule } from './user/user.module';
import { WebhooksController } from './webhooks/webhooks.controller';
import { WebhooksModule } from './webhooks/webhooks.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      playground: false,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      resolvers: {
        Date: DateTimeResolver,
        Email: EmailAddressResolver,
      },
    }),
    AuthModule,
    UserModule,
    IngredientModule,
    BuildModule,
    TouchModule,
    RecipeModule,
    RecipeBookModule,
    ProfileModule,
    UnitModule,
    InventoryModule,
    StockModule,
    WebhooksModule,
  ],
  controllers: [WebhooksController],
  providers: [
    PrismaService,
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class AppModule {}
