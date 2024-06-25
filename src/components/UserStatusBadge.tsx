import { Chip } from "@nextui-org/react";

interface UserStatusBadgeProps {
  status: string;
  isMiladyOG?: boolean;
  isRemiliaOfficial?: boolean;
}

const UserStatusBadge = ({ status, isMiladyOG, isRemiliaOfficial }: UserStatusBadgeProps) => {
  return (
    <div className="flex items-center">
      <Chip color={getStatusColor(status)} variant="flat">
        {status}
      </Chip>
      {isMiladyOG && (
        <Chip color="primary" variant="flat" className="ml-2">
          Milady OG
        </Chip>
      )}
      {isRemiliaOfficial && (
        <Chip color="secondary" variant="flat" className="ml-2">
          Remilia Official
        </Chip>
      )}
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'success'; // Green
    case 'Moderate':
      return 'warning'; // Orange
    case 'Risk':
      return 'danger'; // Red
    default:
      return 'default';
  }
};

export default UserStatusBadge;
