import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ShortUrlResolver } from '../../infrastructure/resolvers/short-url.resolver';
import { AuthResolver } from '../../infrastructure/resolvers/auth.resolver';
import { ShortUrlSystemModule } from '../../systems/short-url/short-url.module';
import { ShortUrlGraphqlApp } from './graphql.service';
import { AuthSystemModule } from '../../systems/auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/infrastructure/schema.gql'),
      sortSchema: true,
      playground: true,
      path: '/graphql',
      context: ({ req, res }) => ({ req, res }),
    }),
    ShortUrlSystemModule,
    AuthSystemModule,
  ],
  providers: [ShortUrlResolver, AuthResolver, ShortUrlGraphqlApp],
})
export class GraphqlAppModule {}
