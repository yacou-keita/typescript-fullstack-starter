import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { UserInput, CredentialInput, UserResponse, } from "../types";
import bcrypt from "bcryptjs"


@Resolver()
export class userResolver {
  
  @Mutation(() => UserResponse)
  async register(@Arg("input") input: UserInput): Promise<UserResponse> {
    const {firstname, lastname, username} = input
    
    if (!firstname)
    {
      return {
        errors: [{
          field: 'firstname',
          message: "firtname is require"
        }]
      }
    }

    if (!lastname)
    {
      return {
        errors: [{
          field: 'lastname',
          message: "lastname is require"
        }]
      }
    }

    if(!username){
      return {
        errors: [{
          field: 'username',
          message: "lastname is require"
        }]
      }
    }
    const userAlreadyExiste = await User.findOne({ where: { username } });
    if (userAlreadyExiste)
    {
      return {
        errors: [{
          field: 'username',
          message: "that username  already exist"
        }]
      }
    }
    if ( input.username.length <= 2)
    {
      return {
        errors: [{
          field: 'username',
          message: "Length must be greater than 2"
        }]
      }
    }

    if ( input.password.length <= 3)
    {
      return {
        errors: [{
          field: 'password',
          message: "Length must be greater than 3"
        }]
      }
    }

    input.password = await bcrypt.hash("password",8);
    const user = await User.create(input).save();

    return {user}
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("input") input: CredentialInput,
    @Ctx() {req}: any
    ): Promise<UserResponse> {
    const {password, username} = input
    const user = await User.findOne({ where: { username: input.username } });
    if (!username)
    {
      return {
        errors: [{
          field: 'username',
          message: "username is require"
        }]
      }
    }

    if (!password)
    {
      return {
        errors: [{
          field: 'password',
          message: "password is require"
        }]
      }
    }

    if ( !user )
    {
      return {
        errors: [{
          field: 'username',
          message: "that username doesn't exist"
        }]
      }
    }

    console.log('password', password)
    console.log('user.password', user.password)
    const isValidePassword = await bcrypt.compare(input.password, user.password)
    console.log('isValidePassword', isValidePassword)
    // if (!isValidePassword)
    // {
    //   return {
    //     errors: [{
    //       field: 'password',
    //       message: "password is incorrect"
    //     }]
    //   }
    // }
    
    //req.session!.id = String(user.id)
   

    return{
      user
    }
  }

  @Query(() => User, { nullable: true })
  async getByUsername(
    @Arg("username") username: string
  ): Promise<User | undefined> {
    return User.findOne({ where: { username } });
  }

  
}
