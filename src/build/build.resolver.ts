import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { BuildService } from './build.service';
import { TouchService } from '../touch/touch.service';
import { RecipeService } from '../recipe/recipe.service';
import {
  CreateBuildInput,
  UpdateBuildInput,
  ChangeBuildPermissionInput,
  Build,
  Permission,
} from '../graphql';
import { CurrentUserId } from '../auth/decorators/currentUserId-decorator';
import { resolvePermission } from '../utils/resolvePermission';
import { UserService } from 'src/user/user.service';

@Resolver('Build')
export class BuildResolver {
  constructor(
    private buildService: BuildService,
    private touchService: TouchService,
    private recipeService: RecipeService,
    private userService: UserService,
  ) {}

  @Mutation('createBuild')
  create(
    @Args('createBuildInput') createBuildInput: CreateBuildInput,
    @CurrentUserId() userId: string,
  ) {
    console.log('hello hello');
    return this.buildService.create(
      {
        recipe: { name: createBuildInput.recipe.name },
        buildName: createBuildInput.buildName,
        instructions: createBuildInput.instructions,
        glassware: createBuildInput.glassware,
        ice: createBuildInput.ice,
        touchArray: createBuildInput.touchArray,
      },
      userId,
    );
  }

  @Query('findAllBuilds')
  findAll() {
    return this.buildService.findAll();
  }

  @Query('findOneBuild')
  findOne(@Args('id') id: string) {
    return this.buildService.findOne(id);
  }

  @Query('findFolloweddUsersBuildPermission')
  findFolloweddUsersBuildPermission(
    @CurrentUserId() userId: string,
    @Args('buildId') buildId: string,
  ) {
    return this.buildService.findFolloweddUsersBuildPermission({
      userId,
      buildId,
    });
  }

  @Query('usersBuilds')
  usersBuilds(@CurrentUserId() userId: string) {
    console.log(userId);
    return this.buildService.usersBuilds(userId);
  }

  @Mutation('updateBuild')
  update(
    @Args('updateBuildInput') updateBuildInput: UpdateBuildInput,
    @CurrentUserId() userId: string,
  ) {
    if (!resolvePermission(updateBuildInput.permission, Permission.MANAGER)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    try {
      return this.buildService.update(updateBuildInput, userId);
    } catch (err) {
      throw new Error('Something has gone wrong with your update');
    }
  }

  @Mutation('removeBuild')
  remove(
    @Args('buildId') buildId: string,
    @Args('permission') permission: Permission,
  ) {
    console.log(permission);
    if (!resolvePermission(permission, Permission.OWNER)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    return this.buildService.remove(buildId);
  }

  @Mutation('changeBuildPermission')
  changeBuildPermission(
    @Args('changeBuildPermissionInput')
    changeBuildPermissionInput: ChangeBuildPermissionInput,
  ) {
    console.log('top of resolver', changeBuildPermissionInput.userPermission);
    if (
      !resolvePermission(
        changeBuildPermissionInput.userPermission,
        changeBuildPermissionInput.desiredPermission,
      )
    ) {
      throw new Error('You do not have permission to do that, Dave');
    }
    try {
      return this.buildService.changeBuildPermission(
        changeBuildPermissionInput,
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Mutation('deleteBuildPermission')
  deleteBuildPermission(
    @Args('changeBuildPermissionInput')
    changeBuildPermissionInput: ChangeBuildPermissionInput,
  ) {
    console.log('resolver hit');
    if (
      !resolvePermission(
        changeBuildPermissionInput.userPermission,
        changeBuildPermissionInput.desiredPermission,
      )
    ) {
      throw new Error('You do not have permission to do that, Dave');
    }
    return this.buildService.deleteBuildPermission(
      changeBuildPermissionInput.userId,
      changeBuildPermissionInput.buildId,
    );
  }

  @ResolveField('touch')
  async touch(@Parent() build: Build) {
    return this.touchService.touch(build.id);
  }
  @ResolveField('recipe')
  async recipe(@Parent() build) {
    console.log(build.recipeName);
    return this.recipeService.findOne(build.recipeName);
  }

  @ResolveField('createdBy')
  async createdBy(@Parent() build: Build) {
    return this.userService.findOne(build.createdById);
  }
}
