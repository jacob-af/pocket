import { Permission, UserBookPermission } from '../graphql';

import { BuildService } from 'src/build/build.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecipeBookService {
  constructor(
    private prisma: PrismaService,
    private buildService: BuildService,
  ) {}

  async create({
    name,
    description,
    userId,
  }: {
    name: string;
    description: string;
    userId: string;
  }) {
    const recipeBook = await this.prisma.recipeBook.create({
      data: {
        name,
        description,
        createdBy: { connect: { id: userId } },
        editedBy: { connect: { id: userId } },
      },
    });
    const {
      recipeBookUser: { permission },
    } = await this.changeRecipeBookPermission({
      userId,
      recipeBookId: recipeBook.id,
      permission: Permission.OWNER,
    });
    return {
      ...recipeBook,
      permission: permission,
    };
  }

  update({
    id,
    name,
    description,
  }: {
    id: string;
    name: string;
    description: string;
  }) {
    return this.prisma.recipeBook.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });
  }

  remove(id: string) {
    return this.prisma.recipeBook.delete({ where: { id } });
  }

  async addBuildToRecipeBook({
    buildId,
    recipeBookId,
  }: {
    buildId: string;
    recipeBookId: string;
  }) {
    await this.prisma.recipeBookBuild.create({
      data: {
        recipeBookId,
        buildId,
      },
      include: {
        build: true,
      },
    });
    return {
      message: `Build Successfully Added`,
    };
  }

  async removeBuildFromRecipeBook({
    buildId,
    recipeBookId,
  }: {
    buildId: string;
    recipeBookId: string;
  }) {
    await this.prisma.recipeBookBuild.delete({
      where: {
        buildId_recipeBookId: {
          recipeBookId,
          buildId,
        },
      },
    });
    return {
      message: `Build Successfully Removed`,
    };
  }

  async changeRecipeBookPermission({
    userId,
    recipeBookId,
    permission,
  }: {
    userId: string;
    recipeBookId: string;
    permission: Permission;
  }) {
    const recipeBookUser = await this.prisma.recipeBookUser.upsert({
      where: {
        userId_recipeBookId: {
          userId,
          recipeBookId,
        },
      },
      update: {
        permission,
      },
      create: {
        userId,
        recipeBookId,
        permission,
      },
    });
    return {
      recipeBookUser,
      status: { message: 'Build is Shared' },
    };
  }

  async removeRecipeBookPermission({
    userId,
    recipeBookId,
  }: {
    userId: string;
    recipeBookId: string;
  }) {
    const bookUser = await this.prisma.recipeBookUser.delete({
      where: {
        userId_recipeBookId: {
          userId,
          recipeBookId,
        },
      },
      include: {
        user: true,
        recipeBook: true,
      },
    });
    return {
      bookUser,
      status: {
        message: `User ${bookUser.user.userName}no longer has access to Recipe Book ${bookUser.recipeBook.name}`,
      },
    };
  }

  async userRecipeBooks(userId: string) {
    const bookList = await this.prisma.recipeBookUser.findMany({
      where: {
        userId: userId,
      },
      include: {
        recipeBook: true, // Include the RecipeBook model data
      },
    });
    console.log('yes, the user recipe books');
    const sharedBooks = bookList.map((b) => {
      return {
        ...b.recipeBook,
        permission: b.permission,
      };
    });
    return sharedBooks;
  }

  async recipeBook(name: string) {
    return await this.prisma.recipeBook.findUnique({ where: { name: name } });
  }

  async build(recipeBookId: string, userId: string) {
    try {
      // Query the RecipeBookBuild table to fetch builds associated with the specified recipe book
      const builds = await this.prisma.recipeBookBuild.findMany({
        where: {
          recipeBookId: recipeBookId,
        },
        include: {
          build: {
            include: {
              buildUser: {
                where: {
                  userId: userId,
                },
              },
            },
          },
        },
      });

      return builds.map((book) => {
        return book.build.buildUser[0] !== undefined
          ? {
              ...book.build,
              permission: book.build.buildUser[0].permission,
            }
          : {
              ...book.build,
              permission: 'VIEW',
            };
      }); // Extract the builds or return an empty array
    } catch (error) {
      console.error('Error fetching builds for recipe book:', error);
      throw error;
    }
  }

  async findFolloweddUsersBookPermission({
    userId,
    recipeBookId,
  }: {
    userId: string;
    recipeBookId: string;
  }): Promise<UserBookPermission[]> {
    // Retrieve the list of users the current user follows
    const followingRelations = await this.prisma.follow.findMany({
      where: { followedById: userId },
      include: { following: true },
    });

    // Retrieve the list of users the current user has blocked
    const blockedRelations = await this.prisma.follow.findMany({
      where: {
        OR: [
          { followingId: userId, relationship: 'Blocked' },
          { followedById: userId, relationship: 'Blocked' },
        ],
      },
      include: {
        following: true,
        followedBy: true,
      },
    });

    // Retrieve permission information for the specific book
    const bookUserPermissions = await this.prisma.recipeBookUser.findMany({
      where: {
        recipeBookId,
        userId: {
          in: followingRelations.map((relation) => relation.following?.id),
        },
      },
    });
    console.log('why', bookUserPermissions.length, 'just why');
    // Create a map for quick lookup of permissions by user ID
    const permissionMap = new Map<string, string | null>();
    bookUserPermissions.forEach((permission) => {
      //console.log(permission);
      permissionMap.set(permission.userId, permission.permission);
    });

    // Create a set of blocked user IDs for efficient lookups
    const blockedUserIds = new Set<string>();
    blockedRelations.forEach((relation) => {
      if (relation.following) {
        blockedUserIds.add(relation.following.id);
      }
      if (relation.followedBy) {
        blockedUserIds.add(relation.followedBy.id);
      }
    });

    // Process the following relations and filter out blocked users
    const userBookPermissions: UserBookPermission[] = [];

    for (const relation of followingRelations) {
      const user = relation.following;
      if (user && !blockedUserIds.has(user.id)) {
        // Determine the permission level for the user
        const permission = permissionMap.get(user.id) || null;

        // Debugging: log the user ID and permission
        console.log(`User ID: ${user.id}, Permission: ${permission}`);

        // Add the user and permission level to the result
        userBookPermissions.push({
          user,
          permission,
        });
      }
    }

    // Return the list of user and permission pairs
    return userBookPermissions;
  }
}
