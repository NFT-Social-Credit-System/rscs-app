import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Button,
  Input,
  Pagination,
  Modal,
  Select,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  SelectItem,
  Chip,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { UserData, initialUsers } from "./InitialUserData";
import UserStatusBadge from "./UserStatusBadge"; // Import the new component

// Allows to properly format the Follower count to make it readable.
const formatFollowers = (followers: number) => {
  if (followers >= 10000) {
    return (followers / 1000).toFixed(1) + "K";
  }
  return followers.toLocaleString();
};

// Calculates the approval rate based on likes and dislikes.
const calculateApprovalRate = (likes: number, dislikes: number) => {
  const totalVotes = likes + dislikes;
  return totalVotes === 0 ? 0 : (likes / totalVotes) * 100;
};

// Determines the status based on the approval rate.
const getStatus = (likes: number, dislikes: number) => {
  const approvalRate = calculateApprovalRate(likes, dislikes);
  if (approvalRate >= 70) return "Approved";
  if (approvalRate >= 40) return "Moderate";
  return "Risk";
};

const UserTable = () => {
  const [users, setUsers] = useState<UserData[]>(initialUsers); // State to store user data
  const [search, setSearch] = useState(""); // State to store search input
  const [page, setPage] = useState(1); // State to store current page
  const [filter, setFilter] = useState("approvalRateDesc"); // State to store current filter
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // State to control filter modal visibility
  const itemsPerPage = 10; // Number of items per page

  // Filter users based on search input
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
  );

  // Sort users based on the selected filter
  const sortUsers = (users: UserData[]) => {
    switch (filter) {
      case "followers":
        return users.sort((a, b) => b.followers - a.followers);
      case "nameAsc":
        return users.sort((a, b) => a.name.localeCompare(b.name));
      case "nameDesc":
        return users.sort((a, b) => b.name.localeCompare(a.name));
      case "approvalRateAsc":
        return users.sort(
          (a, b) =>
            calculateApprovalRate(a.score.up, a.score.down) -
            calculateApprovalRate(b.score.up, b.score.down)
        );
      case "approvalRateDesc":
        return users.sort(
          (a, b) =>
            calculateApprovalRate(b.score.up, b.score.down) -
            calculateApprovalRate(a.score.up, a.score.down)
        );
      case "statusApproved":
        return users.filter(
          (user) => getStatus(user.score.up, user.score.down) === "Approved"
        );
      case "statusModerate":
        return users.filter(
          (user) => getStatus(user.score.up, user.score.down) === "Moderate"
        );
      case "statusRisk":
        return users.filter(
          (user) => getStatus(user.score.up, user.score.down) === "Risk"
        );
      case "remiliaOfficial":
        return users.filter((user) => user.isRemiliaOfficial);
      case "miladyOG":
        return users.filter((user) => user.isMiladyOG);
      default:
        return users;
    }
  };

  const sortedUsers = sortUsers(filteredUsers); // Get sorted users
  const paginatedUsers = sortedUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  ); // Get paginated users

  // Handle thumbs up action
  const handleThumbsUp = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, score: { ...user.score, up: user.score.up + 1 } }
          : user
      )
    );
  };

  // Handle thumbs down action
  const handleThumbsDown = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, score: { ...user.score, down: user.score.down + 1 } }
          : user
      )
    );
  };

  // Update user status based on likes and dislikes
  useEffect(() => {
    setUsers(
      users.map((user) => ({
        ...user,
        status: getStatus(user.score.up, user.score.down),
      }))
    );
  }, [users]);

  // Apply filter and close modal
  const applyFilter = () => {
    setIsFilterModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button color="primary" className="bg-blue-100 text-blue-500 mr-2">
            Submit Account
          </Button>
          <Button color="secondary" className="bg-blue-100 text-blue-500">
            Claim Account
          </Button>
        </div>
        <div className="flex items-center">
          <Input
            isClearable
            className="w-full max-w-xs mb-2"
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
          />
          <Button
            color="primary"
            className="ml-2"
            onClick={() => setIsFilterModalOpen(true)}
          >
            Filter
          </Button>
        </div>
      </div>
      <Table
        aria-label="User table"
        className="h-auto min-w-full nextui-table"
        selectionMode="none"
      >
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>TWITTER ACCOUNT</TableColumn>
          <TableColumn>APPROVAL STATUS BY COMMUNITY</TableColumn>
          <TableColumn>CREDIT SCORE</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <User
                  name={user.name}
                  description={`Followers: ${formatFollowers(user.followers)}`}
                  avatarProps={{
                    src: user.avatarUrl,
                    size: "lg",
                    radius: "full",
                    className: "object-cover w-14 h-14",
                  }}
                />
              </TableCell>
              <TableCell>@{user.username}</TableCell>
              <TableCell>
                <UserStatusBadge
                  status={user.status}
                  isMiladyOG={user.isMiladyOG}
                  isRemiliaOfficial={user.isRemiliaOfficial}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 credit-score">
                  <Button size="sm" className="nextui-button-chip thumbs-up" onClick={() => handleThumbsUp(user.id)}>
                    👍 <span className="ml-1">{user.score.up}</span>
                  </Button>
                  <Button size="sm" className="nextui-button-chip thumbs-down" onClick={() => handleThumbsDown(user.id)}>
                    👎 <span className="ml-1">{user.score.down}</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        total={Math.ceil(filteredUsers.length / itemsPerPage)}
        initialPage={page}
        onChange={(page) => setPage(page)}
        className="mt-4"
      />
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>
            <h3>Filter Users</h3>
          </ModalHeader>
          <ModalBody>
            <Select
              label="Select Filter"
              placeholder="Choose a filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <SelectItem key="followers">Followers</SelectItem>
              <SelectItem key="nameAsc">Name A-Z</SelectItem>
              <SelectItem key="nameDesc">Name Z-A</SelectItem>
              <SelectItem key="approvalRateAsc">
                Approval Rate Ascending
              </SelectItem>
              <SelectItem key="approvalRateDesc">
                Approval Rate Descending
              </SelectItem>
              <SelectItem key="statusApproved">
                <Chip color="success" variant="flat" className="mr-2">
                  Approved
                </Chip>
              </SelectItem>
              <SelectItem key="statusModerate">
                <Chip color="warning" variant="flat" className="mr-2">
                  Moderate
                </Chip>
              </SelectItem>
              <SelectItem key="statusRisk">
                <Chip color="danger" variant="flat" className="mr-2">
                  Risk
                </Chip>
              </SelectItem>
              <SelectItem key="remiliaOfficial">
                <Chip color="secondary" variant="flat" className="mr-2">
                  Remilia Official
                </Chip>
              </SelectItem>
              <SelectItem key="miladyOG">
                <Chip color="primary" variant="flat" className="mr-2">
                  Milady OG
                </Chip>
              </SelectItem>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsFilterModalOpen(false)}>Close</Button>
            <Button onClick={applyFilter}>Apply</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserTable;
