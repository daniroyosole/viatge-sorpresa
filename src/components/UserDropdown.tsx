import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';
import './UserDropdown.css';

interface User {
  id: string;
  name: string;
  completed?: boolean;
}

interface UserDropdownProps {
  selectedUser: string;
  onUserSelect: (userName: string) => void;
  disabled?: boolean;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ 
  selectedUser, 
  onUserSelect, 
  disabled = false 
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsersAndResponses = async () => {
      try {
        setLoading(true);
        
        // Fetch users
        const usersRef = ref(database, 'users');
        const usersSnapshot = await get(usersRef);
        
        // Fetch completed responses (only names)
        const respostesRef = ref(database, 'respostes');
        const respostesSnapshot = await get(respostesRef);
        
        let completedUsers: string[] = [];
        if (respostesSnapshot.exists()) {
          const respostesData = respostesSnapshot.val();
          completedUsers = Object.values(respostesData).map((response: unknown) => (response as { name: string }).name);
        }
        
        if (usersSnapshot.exists()) {
          const usersData = usersSnapshot.val();
          const usersArray: User[] = Object.entries(usersData).map(([id, name]) => ({
            id,
            name: name as string,
            completed: completedUsers.includes(name as string)
          }));
          // Sort users alphabetically by name
          usersArray.sort((a, b) => a.name.localeCompare(b.name));
          setUsers(usersArray);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Error al carregar els usuaris de la base de dades');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndResponses();
  }, []);

  const handleUserSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onUserSelect(event.target.value);
  };

  if (loading) {
    return <div className="loading">Carregant shekes i bæs...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dropdown-container">
      <label htmlFor="user-select">Qui ets?</label>
      <select 
        id="user-select"
        value={selectedUser}
        onChange={handleUserSelect}
        className="user-dropdown"
        disabled={disabled}
      >
        <option value="">Tria un nom...</option>
        {users.map((user) => (
          <option 
            key={user.id} 
            value={user.name}
            disabled={user.completed}
          >
            {user.name}{user.completed ? ' (Completat)' : ''}
          </option>
        ))}
      </select>
      

    </div>
  );
};

export default UserDropdown;
