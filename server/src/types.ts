import { InputType, Field } from "type-graphql";
import {Request, Response,} from "express";


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

export type MyContext = {
  req: Request 
  res: Response
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
