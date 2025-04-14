import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthResponse } from '../types/auth.type';
import { ShortUrlGraphqlApp } from '../../apps/graphql/graphql.service';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly shortUrlGraphqlApp: ShortUrlGraphqlApp) {}

  @Mutation(() => AuthResponse)
  async signup(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthResponse> {
    return await this.shortUrlGraphqlApp.signup(email, password);
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthResponse> {
    return await this.shortUrlGraphqlApp.login(email, password);
  }
}
