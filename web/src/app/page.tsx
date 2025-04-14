'use client';

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { AuthForm } from '../components/AuthForm';
import { Dashboard } from '../components/Dashboard';
import { useAuth } from '../lib/auth-context';

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <Container maxW="container.xl" py={16}>
      <VStack spacing={8} align="center">
        <Box textAlign="center">
          <Heading size="2xl" mb={4}>
            URL Shortener
          </Heading>
          <Text fontSize="xl" color="gray.300">
            Create short, memorable links in seconds
          </Text>
        </Box>

        <VStack spacing={8} width="100%" maxW="400px">
          <AuthForm mode="signup" />
        </VStack>
      </VStack>
    </Container>
  );
}
