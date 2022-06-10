import { InputType, Field, ObjectType } from "type-graphql";
import {Request, Response,} from "express";
import { User } from "./entities/User";


@InputType()
export class UserInput {

  @Field(() => String)
  firstname!: string;

  @Field(() => String)
  lastname!: string;

  @Field(() => String)
  username!: string;

  @Field(() => String)
  password!: string;
}

@InputType()
export class CredentialInput {

  @Field(() => String)
  username!: string;

  @Field(() => String)
  password!: string;
}

export type MyContext = {
  req: Request 
  res: Response
}

@ObjectType()
export class FieldError {
  @Field()
  field:string
  @Field()
  message:string
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[]

  @Field(() => User, {nullable: true})
  user?: User
}

// @ObjectType()
// class FieldError {
//   @Field()
//   field:string
//   @Field()
//   message:string
// }

// @ObjectType()
// class UserResponse {
//   @Field(() => [FieldError], {nullable: true})
//   errors?: FieldError[]

//   @Field(() => UserInput, {nullable: true})
//   user?: UserInput
// }
