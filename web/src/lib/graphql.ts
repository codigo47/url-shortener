import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      userId
      email
    }
  }
`;

export const CREATE_SHORT_URL = gql`
  mutation CreateShortUrl($targetUrl: String!) {
    createShortUrl(targetUrl: $targetUrl) {
      slug
    }
  }
`;

export const MODIFY_SLUG = gql`
  mutation ModifySlug($slug: String!, $newSlug: String!) {
    modifySlug(slug: $slug, newSlug: $newSlug) {
      slug
      targetUrl
    }
  }
`;

export const GET_USER_URLS = gql`
  query GetUserUrls {
    getShortUrlsByUser {
      slug
      targetUrl
      visits
    }
  }
`;