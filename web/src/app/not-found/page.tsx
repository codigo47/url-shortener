'use client';

import { Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxW="container.xl" py={16}>
      <VStack spacing={6} textAlign="center">
        <Heading size="4xl">404</Heading>
        <Heading size="xl">Page Not Found</Heading>
        <Text fontSize="lg" color="gray.600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Text>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={() => router.push('/')}
        >
          Return Home
        </Button>
      </VStack>
    </Container>
  );
}