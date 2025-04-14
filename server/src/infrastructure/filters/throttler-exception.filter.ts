import { Catch } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(ThrottlerException)
export class GqlThrottlerExceptionFilter implements GqlExceptionFilter {
  catch() {
    return new GraphQLError('Too Many Requests', {
      extensions: {
        code: 'THROTTLE',
        http: { status: 429 },
      },
    });
  }
}
