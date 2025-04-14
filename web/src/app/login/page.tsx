'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { AuthForm } from '../../components/AuthForm';
import { useAuth } from '../../lib/auth-context';
import { Dashboard } from '../../components/Dashboard';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <Container maxW="container.xl" py={16}>
      <VStack spacing={8} align="center">
        <Box textAlign="center">
          <Heading size="2xl" mb={4}>
            Welcome Back
          </Heading>
          <Text fontSize="xl" color="gray.300">
            Log in to manage your shortened URLs
          </Text>
        </Box>

        <Box width="100%" maxW="400px">
          <AuthForm mode="login" />
        </Box>
      </VStack>
    </Container>
  );
}