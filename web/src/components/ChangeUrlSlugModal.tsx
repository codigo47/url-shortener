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
  VStack,
  Button,
  Text,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { MODIFY_SLUG, GET_USER_URLS } from '../lib/graphql';

interface Url {
  slug: string;
  targetUrl: string;
  visits: number;
}

interface ChangeUrlSlugModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUrl: Url | null;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export const ChangeUrlSlugModal = ({
  isOpen,
  onClose,
  selectedUrl,
  onSuccess,
  onError,
}: ChangeUrlSlugModalProps) => {
  const [newSlug, setNewSlug] = useState('');
  const [slugError, setSlugError] = useState('');

  const [modifySlug, { loading: updating }] = useMutation(MODIFY_SLUG, {
    onCompleted: () => {
      onSuccess();
      onClose();
      setNewSlug('');
    },
    onError: (error) => {
      onError(error);
    },
    refetchQueries: [{ query: GET_USER_URLS }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUrl) return;

    if (newSlug.length >= 7) {
      setSlugError('Slug must be less than 7 characters');
      return;
    }

    setSlugError('');
    modifySlug({
      variables: {
        slug: selectedUrl.slug,
        newSlug,
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change URL Slug</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} as="form" onSubmit={handleSubmit}>
            <Text>Target URL: {selectedUrl?.targetUrl}</Text>
            <Text>Current Slug: {selectedUrl?.slug}</Text>
            <FormControl isRequired isInvalid={!!slugError}>
              <FormLabel>New Slug</FormLabel>
              <Input
                placeholder="Enter new slug"
                value={newSlug}
                onChange={(e) => {
                  setNewSlug(e.target.value);
                  setSlugError('');
                }}
              />
              {slugError && <FormErrorMessage>{slugError}</FormErrorMessage>}
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              isLoading={updating}
            >
              Change
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};