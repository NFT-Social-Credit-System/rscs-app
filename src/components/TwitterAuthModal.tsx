import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from '@nextui-org/react';
import Image from 'next/image';

interface TwitterAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: () => void;
  children?: React.ReactNode;
}

const TwitterAuthModal: React.FC<TwitterAuthModalProps> = ({ isOpen, onClose, onAuthenticate, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Claim Account</ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center justify-center">
            <Image src="/x.png" alt="Twitter Logo" width={30} height={24} />
            <Button 
              onClick={onAuthenticate}
              color="primary"
            >
              Click here to authenticate with X/Twitter
            </Button>
            {children}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TwitterAuthModal;
