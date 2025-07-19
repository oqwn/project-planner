import React, { useEffect } from 'react';
import { useUserStore } from '../store/userStore';

export const UserList: React.FC = () => {
  const { users, loading, error, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> - {user.email} ({user.role})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
