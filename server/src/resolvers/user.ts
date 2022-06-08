import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { UserInput } from "../types";
// import argon2 from "argon2"

@Resolver()
export class userResolver {
  @Mutation(() => User)
  async register(@Arg("input") input: UserInput): Promise<User | undefined> {
    //  input.password = await argon2.hash(input.password)
    //  console.log('input', input)
    return User.create(input).save();
  }

  @Query(() => User, { nullable: true })
  async getByUsername(
    @Arg("username") username: string
  ): Promise<User | undefined> {
    return User.findOne({ where: { username } });
  }

  @Query ( () => User, { nullable: true })
  async findUser ()
  { 
    const user = await User.find({})
    return user 
  }
}
