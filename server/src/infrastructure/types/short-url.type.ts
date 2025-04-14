import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateShortUrlResponse {
  @Field()
  slug: string;
}

@ObjectType()
export class ShortUrlResponse {
  @Field()
  slug: string;

  @Field()
  targetUrl: string;

  @Field()
  visits: number;
}

@ObjectType()
export class ModifySlugResponse {
  @Field()
  slug: string;

  @Field()
  newSlug: string;

  @Field()
  targetUrl: string;
}
