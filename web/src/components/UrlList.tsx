import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  useToast,
  Text,
  Link,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_URLS } from '../lib/graphql';
import { ChangeUrlSlugModal } from './ChangeUrlSlugModal';

interface Url {
  slug: string;
  targetUrl: string;
  visits: number;
}

export const UrlList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUrl, setSelectedUrl] = useState<Url | null>(null);
  const toast = useToast();

  const { data, loading: loadingUrls } = useQuery(GET_USER_URLS);

  const handleChangeSlug = (url: Url) => {
    setSelectedUrl(url);
    onOpen();
  };

  const handleSuccess = () => {
    toast({
      title: 'Slug updated successfully',
      status: 'success',
      duration: 3000,
    });
  };

  const handleError = (error: Error) => {
    toast({
      title: 'Error updating slug',
      description: error.message,
      status: 'error',
      duration: 3000,
    });
  };

  if (loadingUrls) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Target URL</Th>
            <Th>Short URL</Th>
            <Th>Visits</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.getShortUrlsByUser.map((url: Url) => (
            <Tr key={url.slug}>
              <Td isTruncated maxW="200px">
                {url.targetUrl}
              </Td>
              <Td>
                <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'}/${url.slug}`} isExternal>
                  {`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'}/${url.slug}`}
                </Link>
              </Td>
              <Td>{url.visits}</Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => handleChangeSlug(url)}
                >
                  Change Slug
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <ChangeUrlSlugModal
        isOpen={isOpen}
        onClose={onClose}
        selectedUrl={selectedUrl}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </>
  );
};