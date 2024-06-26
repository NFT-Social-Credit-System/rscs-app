'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import confetti from 'canvas-confetti';

interface AuthSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function AuthSuccessModal({ isOpen, onClose, message }: AuthSuccessModalProps) {
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && !hasShownConfetti) {
      fireConfetti();
      setHasShownConfetti(true);
    }
  }, [isOpen, hasShownConfetti]);

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Authentication Successful</ModalHeader>
        <ModalBody>
          <p>You successfully claimed your Milady Account!</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
