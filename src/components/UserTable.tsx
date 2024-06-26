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
  Spinner,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { UserData, initialUsers } from "./InitialUserData";
import UserStatusBadge from "./UserStatusBadge"; // Import the new component
import { CheckBadgeIcon } from '@heroicons/react/24/solid'; // Import Heroicons
import TwitterAuthModal from './TwitterAuthModal';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

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

// Function to determine if a user is eligible for the gold checkmark
const isGoldCheckmarkEligible = (user: UserData) => {
  const totalVotes = user.score.up + user.score.down;
  const approvalRate = calculateApprovalRate(user.score.up, user.score.down);
  return approvalRate > 90 && totalVotes > 100;
};

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>(initialUsers); // State to store user data
  const [search, setSearch] = useState(""); // State to store search input
  const [page, setPage] = useState(1); // State to store current page
  const [filter, setFilter] = useState("approvalRateDesc"); // State to store current filter
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // State to control filter modal visibility
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false); // State to control submit modal visibility
  const [twitterUsername, setTwitterUsername] = useState(""); // State to store Twitter username
  const [isProcessing, setIsProcessing] = useState(false); // State to track processing status
  const [errorMessage, setErrorMessage] = useState(""); // State to store error messages
  const [successMessage, setSuccessMessage] = useState(""); // State to store success messages
  const [claimedAccounts, setClaimedAccounts] = useState<string[]>([]); // State to store claimed accounts
  const itemsPerPage = 10; // Number of items per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // Add this line
  const searchParams = useSearchParams();
  const auth = searchParams.get('auth');
  const error = searchParams.get('error');


  // Handle auth and error messages
  useEffect(() => {
    if (auth === 'success') {
      setSuccessMessage('Account successfully claimed!');
    } else if (error) {
      setErrorMessage(error);
    }
  }, [auth, error]);

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

  // Check if there are no users after filtering
  const noUsersAvailable = sortedUsers.length === 0;

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

  const handleSubmitAccount = async () => {
    setIsProcessing(true);
    setErrorMessage(""); // Clear any previous error messages
    setSuccessMessage(""); // Clear any previous success messages

    try {
      // Check if the user already exists in the database
      const userExists = users.some(user => user.username === twitterUsername);
      if (userExists) {
        setErrorMessage("This user is already in the database!");
        setIsProcessing(false);
        return;
      }

      // Simulate backend API call to fetch user data
      const fetchUser = await new Promise<UserData>((resolve, reject) => {
        setTimeout(() => {
          // Simulate user not found for "jeffortless"
          if (twitterUsername === "jeffortless") {
            reject(new Error("User not found"));
          } else {
            resolve({
              id: (users.length + 1).toString(),
              name: twitterUsername,
              username: twitterUsername,
              avatarUrl: "https://placeholder.com/150",
              followers: 0,
              score: { up: 0, down: 0 },
              status: "Moderate",
              isRemiliaOfficial: false,
              isMiladyOG: false
            });
          }
        }, 2000);
      });

      // Add the new user to the list
      setUsers(prevUsers => [...prevUsers, fetchUser]);

      setSuccessMessage("✅ Success - Milady has been added");
      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setTwitterUsername("");
        setSuccessMessage("");
      }, 2000); // Close the modal after 2 seconds
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User not found") {
          setErrorMessage("This user wasn't found, try again or submit another Milady");
        } else {
          console.error("Error submitting account:", error);
        }
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // handle claiming accounts
  const handleClaimAccount = async (userId: string) => {
    setIsProcessing(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch('/api/auth/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate OAuth');
      }

      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl; // Redirect to Twitter OAuth
      } else {
        throw new Error(data.message || 'Failed to initiate OAuth');
      }
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to initiate OAuth. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    console.log("Users state updated:", users);
  }, [users]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button
            color="primary"
            className="bg-blue-100 text-blue-500 mr-2"
            onClick={() => setIsSubmitModalOpen(true)}
          >
            Submit Account
          </Button>
          <Button
            color="secondary"
            className="bg-blue-100 text-blue-500"
            onClick={() => {
              setSelectedUserId(users[0]?.id || null); // Use a valid user ID or set to null
              setIsModalOpen(true);
            }}
          >
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
          {noUsersAvailable ? (
            <TableRow key="no-users">
              <TableCell>Unfortunately, there is nobody with this label yet, Milady :( </TableCell>
              <TableCell>{" "}</TableCell>
              <TableCell>{" "}</TableCell>
              <TableCell>{" "}</TableCell>
            </TableRow>
          ) : (
            paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center">
                    <User
                      name={
                        <div className="checkmark-container">
                          {user.name}
                          {isGoldCheckmarkEligible(user) && (
                            <CheckBadgeIcon className="checkmark-icon text-yellow-500" />
                          )}
                          {claimedAccounts.includes(user.id) && (
                            <CheckBadgeIcon className="checkmark-icon text-blue-500" />
                          )}
                        </div>
                      }
                      description={`Followers: ${formatFollowers(user.followers)}`}
                      avatarProps={{
                        src: user.avatarUrl,
                        size: "lg",
                        radius: "full",
                        className: "object-cover w-14 h-14",
                      }}
                    />
                  </div>
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
            ))
          )}
        </TableBody>
      </Table>
      <Pagination
        total={Math.max(1, Math.ceil(sortedUsers.length / itemsPerPage))}
        initialPage={1}
        page={page}
        onChange={(newPage) => setPage(newPage)}
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
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        className="submit-account-modal"
      >
        <ModalContent>
          <ModalHeader>Submit Account</ModalHeader>
          <ModalBody>
            <p>Please provide the link to the account you wish to submit.</p>
            <div className="flex items-center">
              <span>https://twitter.com/</span>
              <Input
                placeholder="username"
                value={twitterUsername}
                onChange={(e) => setTwitterUsername(e.target.value)}
                className="twitter-username-input h-10 ml-2"
              />
            </div>
            {errorMessage && (
              <div className="text-red-500 mt-2">
                <span>❌ {errorMessage}</span>
              </div>
            )}
            {isProcessing && (
              <div className="flex items-center justify-center mt-4">
                <Spinner size="sm" />
                <span className="ml-2">Processing...</span>
              </div>
            )}
            {successMessage && (
              <div className="text-green-500 mt-2">
                <span>{successMessage}</span>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSubmitAccount} disabled={isProcessing || !twitterUsername}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <TwitterAuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAuthenticate={() => {
          if (selectedUserId) {
            handleClaimAccount(selectedUserId);
          }
        }}
      >
        {errorMessage && (
          <div className="text-red-500 mt-2">
            <span>❌ {errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="text-green-500 mt-2">
            <span>✅ {successMessage}</span>
          </div>
        )}
      </TwitterAuthModal>
    </div>
  );
};

export default UserTable;
