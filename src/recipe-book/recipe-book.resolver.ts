import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RecipeBookService } from './recipe-book.service';
import { UserService } from '../user/user.service';

import { resolvePermission } from 'src/utils/resolvePermission';
import { CurrentUserId } from 'src/auth/decorators/currentUserId-decorator';
import { Permission, RecipeBook } from 'src/graphql';
import { Public } from 'src/auth/decorators/public-decorators';

@Resolver('RecipeBook')
export class RecipeBookResolver {
  constructor(
    private readonly recipeBookService: RecipeBookService,
    private readonly userService: UserService,
  ) {}

  @Mutation('createRecipeBook')
  create(
    @Args('name') name: string,
    @Args('description') description: string,
    @CurrentUserId() userId: string,
  ) {
    return this.recipeBookService.create({
      name,
      description,
      userId,
    });
  }

  @Mutation('updateRecipeBook')
  update(
    @Args('id') id: string,
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('permission') permission: Permission,
  ) {
    if (!resolvePermission(permission, Permission.MANAGER)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    return this.recipeBookService.update({
      id,
      name,
      description,
    });
  }

  @Mutation('removeRecipeBook')
  remove(@Args('id') id: string, @Args('permission') permission: Permission) {
    if (!resolvePermission(permission, Permission.OWNER)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    return this.recipeBookService.remove(id);
  }

  @Mutation('addBuildToRecipeBook')
  addBuildToRecipeBook(
    @Args('buildId') buildId: string,
    @Args('recipeBookId') recipeBookId: string,
    @Args('bookPermission') bookPermission: Permission,
    @Args('buildPermission') buildPermission: Permission,
  ) {
    if (!resolvePermission(bookPermission, Permission.VIEW)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    if (!resolvePermission(buildPermission, Permission.MANAGER)) {
      throw new Error('You do not have permission to do that, Dave-o');
    }
    return this.recipeBookService.addBuildToRecipeBook({
      buildId,
      recipeBookId,
    });
  }

  @Mutation('removeBuildFromRecipeBook')
  removeBuildFromRecipeBook(
    @Args('buildId') buildId: string,
    @Args('recipeBookId') recipeBookId: string,
    @Args('bookPermission') bookPermission: Permission,
  ) {
    if (!resolvePermission(bookPermission, Permission.MANAGER)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    return this.recipeBookService.removeBuildFromRecipeBook({
      buildId,
      recipeBookId,
    });
  }

  @Mutation('changeRecipeBookPermission')
  changeRecipeBookPermission(
    @Args('userId') userId: string,
    @Args('recipeBookId') recipeBookId: string,
    @Args('userPermission') userPermission: Permission,
    @Args('desiredPermission') desiredPermission: Permission,
  ) {
    if (!resolvePermission(userPermission, desiredPermission)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    try {
      return this.recipeBookService.changeRecipeBookPermission({
        userId,
        recipeBookId,
        permission: desiredPermission,
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Mutation('removeRecipeBookPermission')
  removeRecipeBookPermission(
    @Args('userId') userId: string,
    @Args('recipeBookId') recipeBookId,
    @Args('permission') permission: Permission,
  ) {
    if (!resolvePermission(permission, Permission.MANAGER)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    return this.recipeBookService.removeRecipeBookPermission({
      userId,
      recipeBookId,
    });
  }

  @Query('findFolloweddUsersBookPermission')
  findFolloweddUsersBookPermission(
    @CurrentUserId() userId: string,
    @Args('recipeBookId') recipeBookId: string,
  ) {
    return this.recipeBookService.findFolloweddUsersBookPermission({
      userId,
      recipeBookId,
    });
  }

  @Public()
  @Query('publicBook')
  publicBook(@Args('name') name: string) {
    return this.recipeBookService.publicBook(name);
  }

  @Public()
  @Query('publicBookList')
  publicBookList() {
    return this.recipeBookService.allBooks({
      where: { isPublic: true },
      orderBy: { name: 'asc' },
    });
  }

  @Public()
  @Query('publicBooks')
  publicBooks(@Args('skip') skip: number, @Args('take') take: number) {
    return this.recipeBookService.publicBooks(skip, take);
  }

  @Query('book')
  book(@Args('name') name: string) {
    return this.recipeBookService.findOne(name);
  }

  @Query('userBookList')
  userBookList(@CurrentUserId() userId: string) {
    return this.recipeBookService.allBooks({
      where: { recipeBookUser: { some: { userId } } },
      orderBy: { name: 'asc' },
    });
  }

  @Query('userBooks')
  userBooks(
    @Args('skip') skip: number,
    @Args('take') take: number,
    @CurrentUserId() userId: string,
  ) {
    return this.recipeBookService.userBooks(skip, take, userId);
  }

  @ResolveField('build')
  async build(
    @Parent() recipeBook: RecipeBook,
    @CurrentUserId() userId: string,
  ) {
    return await this.recipeBookService.build(recipeBook.id, userId);
  }
  @ResolveField('publicBuild')
  async publicBuild(@Parent() recipeBook: RecipeBook) {
    return await this.recipeBookService.publicBuild(recipeBook.id);
  }

  @ResolveField('createdBy')
  async createdBy(@Parent() recipeBook: RecipeBook) {
    return await this.userService.findOne(recipeBook.createdById);
  }
}
