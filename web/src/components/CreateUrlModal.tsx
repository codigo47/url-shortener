import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Text,
  HStack,
  IconButton,
  useClipboard,
  FormErrorMessage,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_SHORT_URL, GET_USER_URLS } from '../lib/graphql';

interface CreateUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateUrlModal = ({ isOpen, onClose }: CreateUrlModalProps) => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isUrlError, setIsUrlError] = useState(false);
  const toast = useToast();
  const { onCopy } = useClipboard(shortUrl);

  const [createShortUrl, { loading }] = useMutation(CREATE_SHORT_URL, {
    onCompleted: (data) => {
      setShortUrl(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${data.createShortUrl.slug}`);
      toast({
        title: 'URL shortened successfully',
        status: 'success',
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating short URL',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    },
    refetchQueries: [{ query: GET_USER_URLS }],
  });

  const validateUrl = (url: string) => {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );
    return urlPattern.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUrl(url)) {
      setIsUrlError(true);
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsUrlError(false);
    createShortUrl({
      variables: {
        targetUrl: url,
      },
    });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setIsUrlError(!validateUrl(value) && value !== '');
  };

  const handleCopy = () => {
    onCopy();
    toast({
      title: 'Copied to clipboard',
      status: 'success',
      duration: 2000,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>URL Shortener</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} as="form" onSubmit={handleSubmit}>
            <FormControl isRequired isInvalid={isUrlError}>
              <FormLabel>URL</FormLabel>
              <Input
                placeholder="Enter your URL"
                value={url}
                onChange={handleUrlChange}
              />
              {isUrlError && (
                <FormErrorMessage>Please enter a valid URL</FormErrorMessage>
              )}
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              isLoading={loading}
            >
              Shorten
            </Button>

            {shortUrl && (
              <HStack width="100%">
                <Text flex="1" isTruncated>
                  {shortUrl}
                </Text>
                <IconButton
                  aria-label="Copy URL"
                  icon={<CopyIcon />}
                  onClick={handleCopy}
                />
              </HStack>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};