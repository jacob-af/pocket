
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Permission {
    VIEW = "VIEW",
    EDIT = "EDIT",
    MANAGER = "MANAGER",
    OWNER = "OWNER",
    BLOCKED = "BLOCKED"
}

export enum Relationship {
    Favorite = "Favorite",
    Close = "Close",
    Following = "Following",
    Blocked = "Blocked"
}

export class CreateUserInput {
    userName: string;
    email: Email;
    password: string;
}

export class LoginInput {
    email: Email;
    password: string;
}

export class CreateBuildInput {
    buildName?: Nullable<string>;
    instructions?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    touchArray?: Nullable<Nullable<TouchInput>[]>;
}

export class UpdateBuildInput {
    buildId?: Nullable<string>;
    buildName?: Nullable<string>;
    instructions?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    touchArray?: Nullable<Nullable<TouchInput>[]>;
    permission?: Nullable<Permission>;
}

export class ChangeBuildPermissionInput {
    userId?: Nullable<string>;
    buildId?: Nullable<string>;
    userPermission?: Nullable<Permission>;
    desiredPermission?: Nullable<Permission>;
}

export class TouchInput {
    order?: Nullable<number>;
    ingredientId?: Nullable<string>;
    amount?: Nullable<number>;
    unit?: Nullable<string>;
}

export class CreateIngredientInput {
    name: string;
    description?: Nullable<string>;
}

export class UpdateIngredientInput {
    id: string;
    name: string;
    description?: Nullable<string>;
}

export class UpdateUserInput {
    id: string;
    userName?: Nullable<string>;
    email?: Nullable<string>;
}

export class AuthPayload {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export class LogoutResponse {
    loggedOut: boolean;
}

export class NewTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export abstract class IQuery {
    abstract hello(): string | Promise<string>;

    abstract ingredients(): Nullable<Ingredient>[] | Promise<Nullable<Ingredient>[]>;

    abstract ingredient(id: number): Nullable<Ingredient> | Promise<Nullable<Ingredient>>;

    abstract allUsers(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract userById(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract login(loginInput: LoginInput): AuthPayload | Promise<AuthPayload>;

    abstract signup(createUserInput: CreateUserInput): AuthPayload | Promise<AuthPayload>;

    abstract logout(userId: string): LogoutResponse | Promise<LogoutResponse>;

    abstract getNewTokens(refreshToken?: Nullable<string>): AuthPayload | Promise<AuthPayload>;

    abstract addBuild(createBuildInput?: Nullable<CreateBuildInput>): Nullable<BuildResponse> | Promise<Nullable<BuildResponse>>;

    abstract updateBuild(updateBuildInput?: Nullable<UpdateBuildInput>): Nullable<ArchiveResponse> | Promise<Nullable<ArchiveResponse>>;

    abstract removeBuild(buildId?: Nullable<string>, permission?: Nullable<Permission>): Nullable<BuildResponse> | Promise<Nullable<BuildResponse>>;

    abstract changeBuildPermission(userId?: Nullable<string>, buildId?: Nullable<string>, userPermission?: Nullable<Permission>, desiredPermission?: Nullable<Permission>): Nullable<BuildPermissionResponse> | Promise<Nullable<BuildPermissionResponse>>;

    abstract deleteBuildPermission(userId?: Nullable<string>, buildId?: Nullable<string>, userPermission?: Nullable<Permission>, permission?: Nullable<Permission>): Nullable<BuildPermissionResponse> | Promise<Nullable<BuildPermissionResponse>>;

    abstract updateTouch(newTouchArray?: Nullable<Nullable<TouchInput>[]>, permission?: Nullable<Permission>, buildId?: Nullable<string>, version?: Nullable<number>): Nullable<Nullable<Touch>[]> | Promise<Nullable<Nullable<Touch>[]>>;

    abstract createIngredient(createIngredientInput: CreateIngredientInput): Ingredient | Promise<Ingredient>;

    abstract createManyIngredient(createIngredientInputs: Nullable<CreateIngredientInput>[]): StatusMessage | Promise<StatusMessage>;

    abstract updateIngredient(updateIngredientInput: UpdateIngredientInput): Ingredient | Promise<Ingredient>;

    abstract removeIngredient(id: string): Nullable<Ingredient> | Promise<Nullable<Ingredient>>;

    abstract followUser(followId: string, relationship?: Nullable<Relationship>): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;

    abstract unFollowUser(unfollowId: string): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;

    abstract blockUser(blockId: string): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;

    abstract unblockUser(unblockId: string): Nullable<StatusMessage> | Promise<Nullable<StatusMessage>>;
}

export class Build {
    id: string;
    buildName: string;
    createdAt?: Nullable<Date>;
    editedAt?: Nullable<Date>;
    createdBy?: Nullable<User>;
    editedBy?: Nullable<User>;
    instructions?: Nullable<string>;
    notes?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    permission?: Nullable<Permission>;
    touch?: Nullable<Nullable<Touch>[]>;
    version?: Nullable<number>;
    archivedBuild?: Nullable<Nullable<ArchivedBuild>[]>;
}

export class ArchivedBuild {
    id: string;
    buildId: string;
    buildName: string;
    createdAt?: Nullable<Date>;
    createdBy?: Nullable<User>;
    instructions?: Nullable<string>;
    notes?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    version?: Nullable<number>;
    archivedTouch?: Nullable<Nullable<ArchivedTouch>[]>;
}

export class BuildUser {
    user: User;
    build: Build;
    permission?: Nullable<Permission>;
}

export class CompleteBuild {
    id: string;
    buildName: string;
    createdAt?: Nullable<Date>;
    editedAt?: Nullable<Date>;
    createdBy?: Nullable<User>;
    editedBy?: Nullable<User>;
    about?: Nullable<string>;
    notes?: Nullable<string>;
    glassware?: Nullable<string>;
    ice?: Nullable<string>;
    instructions?: Nullable<string>;
    permission?: Nullable<Permission>;
    completeTouch?: Nullable<Nullable<CompleteTouch>[]>;
}

export class BuildResponse {
    build?: Nullable<Build>;
    permission?: Nullable<Permission>;
}

export class ArchiveResponse {
    build?: Nullable<Build>;
    archivedBuild?: Nullable<ArchivedBuild>;
}

export class BuildPermissionResponse {
    buildUser?: Nullable<BuildUser>;
    permission?: Nullable<Permission>;
}

export class Touch {
    id: string;
    build?: Nullable<Build>;
    order?: Nullable<number>;
    amount?: Nullable<number>;
    unit?: Nullable<string>;
    version?: Nullable<number>;
    ingredient?: Nullable<Ingredient>;
}

export class ArchivedTouch {
    id: string;
    archivedBuild?: Nullable<Build>;
    order?: Nullable<number>;
    amount?: Nullable<number>;
    unit?: Nullable<string>;
    version?: Nullable<number>;
    ingredient?: Nullable<Ingredient>;
}

export class CompleteTouch {
    id: string;
    order?: Nullable<number>;
    ingredientId?: Nullable<string>;
    amount?: Nullable<number>;
    unit?: Nullable<string>;
    cost?: Nullable<number>;
}

export class Ingredient {
    id: string;
    name: string;
    description?: Nullable<string>;
}

export class User {
    id: string;
    userName: string;
    email: Email;
    dateJoined?: Nullable<Date>;
    lastEdited?: Nullable<Date>;
    following?: Nullable<Nullable<Following>[]>;
    followedBy?: Nullable<Nullable<Follower>[]>;
    myBuild?: Nullable<Nullable<Build>[]>;
    allBuild?: Nullable<Nullable<Build>[]>;
    buildEditedBy?: Nullable<Nullable<Build>[]>;
}

export class Following {
    id: string;
    userName: string;
    email: Email;
    dateJoined?: Nullable<Date>;
    lastEdited?: Nullable<Date>;
    relationship?: Nullable<Relationship>;
}

export class Follower {
    id: string;
    userName: string;
    email: Email;
    dateJoined?: Nullable<Date>;
    lastEdited?: Nullable<Date>;
}

export class StatusMessage {
    message?: Nullable<string>;
}

export class FollowReturn {
    following?: Nullable<string>;
    relationship?: Nullable<Relationship>;
    status?: Nullable<StatusMessage>;
}

export type Email = any;
type Nullable<T> = T | null;
