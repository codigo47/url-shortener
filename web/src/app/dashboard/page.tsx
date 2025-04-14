'use client';

import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { Dashboard } from '../../components/Dashboard';
import { useAuth } from '../../lib/auth-context';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={16}>
        <Box textAlign="center">
          <Text>Loading...</Text>
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated) {
    redirect('/login');
  }

  return <Dashboard />;
}