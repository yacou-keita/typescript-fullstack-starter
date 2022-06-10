import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { UserInput, CredentialInput} from "../types";
import bcrypt from "bcryptjs"




@ObjectType()
class FieldError {
  @Field()
  field:string
  @Field()
  message:string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[]

  @Field(() => User, {nullable: true})
  user?: User
}

@Resolver()
export class userResolver {
  
  @Mutation(() => UserResponse)
  async register(@Arg("input") input: UserInput): Promise<UserResponse> {
    const {firstname, lastname} = input
    const userAlreadyExiste = await User.findOne({ where: { username:input.username } });
    
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
    // @Arg("password") password: string,
    @Ctx() {req}: any
    ): Promise<UserResponse> {
      
    const user = await User.findOne({ where: { username: input.username } });
    console.log('user', user)
    if ( !user )
    {
      return {
        errors: [{
          field: 'username',
          message: "that username doesn't exist"
        }]
      }
    }

    console.log('password', input.password)
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
