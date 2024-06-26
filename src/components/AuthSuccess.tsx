"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  name: string;
  // Add other user properties as needed
}

const AuthSuccess = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/auth/verify');
        if (response.data.authenticated) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          setError('Authentication failed');
        }
      } catch (error) {
        console.error('Error verifying auth:', error);
        setError('Error verifying authentication');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isAuthenticated) {
    return <div>Verifying authentication...</div>;
  }

  return (
    <div>
      <h1>Authentication Successful</h1>
      <p>Welcome, {user?.name || 'User'}!</p>
    </div>
  );
};

export default AuthSuccess;