import {
  Box,
  Button,
  Container,
  Heading,
  useDisclosure,
  VStack,
  Text,
  Link,
} from '@chakra-ui/react';
import { CreateUrlModal } from './CreateUrlModal';
import { UrlList } from './UrlList';
import { useAuth } from '../lib/auth-context';

export const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated, logout, userEmail } = useAuth();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="lg">URL Shortener Dashboard</Heading>
          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={2}>
            <VStack spacing={1} alignItems="flex-end">
              <Text fontSize="sm" color="gray.500">{userEmail}</Text>
              <Link color="red.500" onClick={logout} fontSize="sm">
                Logout
              </Link>
            </VStack>
          </Box>
        </Box>

        <Button colorScheme="blue" onClick={onOpen} width="fit-content">
          Create Short URL
        </Button>

        {isAuthenticated && <UrlList />}
        <CreateUrlModal isOpen={isOpen} onClose={onClose} />
      </VStack>
    </Container>
  );
};