import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useAuth } from '../lib/auth-context';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      email
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      token
      email
    }
  }
`;

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const { login: loginUser } = useAuth();
  const router = useRouter();

  const isLogin = mode === 'login';
  const mutation = isLogin ? LOGIN_MUTATION : SIGNUP_MUTATION;
  const buttonText = isLogin ? 'Log In' : 'Sign Up';
  const successMessage = isLogin ? 'Logged in successfully' : 'Account created successfully';
  const passwordPlaceholder = isLogin ? 'Enter your password' : 'Create a password';

  const [authMutation, { loading }] = useMutation(mutation, {
    onCompleted: (data) => {
      const { token, email } = isLogin ? data.login : data.signup;
      loginUser(token, email);
      toast({
        title: successMessage,
        status: 'success',
        duration: 3000,
      });
      router.push('/dashboard');
    },
    onError: (error) => {
      toast({
        title: isLogin ? 'Login failed' : 'Error creating account',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authMutation({
        variables: {
          email,
          password,
        },
      });
    } catch {
      // Error is handled in onError callback
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={passwordPlaceholder}
            minLength={6}
          />
        </FormControl>
        <Button
          type="submit"
          width="100%"
          size="lg"
          isLoading={loading}
          colorScheme="blue"
        >
          {buttonText}
        </Button>
        <Text fontSize="sm" color="gray.400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <NextLink
            href={isLogin ? "/" : "/login"}
            style={{ color: 'var(--chakra-colors-brand-400)' }}
          >
            {isLogin ? "Sign up" : "Log in"}
          </NextLink>
        </Text>
      </VStack>
    </Box>
  );
};