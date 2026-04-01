'use client';

import React, { useState, useEffect } from 'react';

// Flaw 1: Types, business logic, and UI are entirely consolidated into a single file.
interface User {
  id: string;
  name: string;
  role: string;
  status: string;
  lastLogin: string;
}

export default function UserDirectoryPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Flaw 2: The fetching logic is hardcoded inside the component body, violating separation of concerns.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Hardcoded localhost dependency - brittle implementation.
        const response = await fetch('http://localhost:3000/api/users');
        const json = await response.json();
        
        if (json.success) {
          setUsers(json.data);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("Network connection failed");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4' }}>
        <p style={{ marginTop: '10px', fontSize: '18px' }}>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'red', fontSize: '16px' }}>{error}</p>
      </div>
    );
  }

  return (
    // Flaw 3: Rendering thousands of DOM nodes at once without pagination or virtualization.
    // This is the primary bottleneck causing browser thread blocking and the "freezing" the founders noted.
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>User Directory</h1>
      </div>

      <div style={styles.listContainer}>
        {users.map((user) => (
          // Flaw 4: A massive inline component definition that must be extracted for modularity.
          <div 
            key={user.id} 
            style={styles.card}
            onClick={() => alert(`User Clicked: ${user.name}`)}
          >
            <div style={styles.cardHeader}>
              <h2 style={styles.nameText}>{user.name}</h2>
              <div style={{
                ...styles.statusBadge, 
                backgroundColor: user.status === 'Active' ? '#d4edda' : '#f8d7da' 
              }}>
                <span style={{ 
                  color: user.status === 'Active' ? '#155724' : '#721c24', 
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {user.status}
                </span>
              </div>
            </div>
            <div style={styles.cardBody}>
              <p style={styles.roleText}>Role: {user.role}</p>
              <p style={styles.dateText}>Last Seen: {new Date(user.lastLogin).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Flaw 5: An overly verbose style object anchored to the bottom of a logic-heavy file.
// In a modern Next.js app, this should be refactored into Tailwind classes or CSS Modules.
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: 'sans-serif',
  },
  header: {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e9ecef',
    marginBottom: '20px',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#212529',
    margin: 0,
  },
  listContainer: {
    padding: '0 20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '20px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    border: '1px solid #e9ecef',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  nameText: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#343a40',
    margin: 0,
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
  },
  cardBody: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleText: {
    fontSize: '14px',
    color: '#6c757d',
    margin: 0,
    fontWeight: 500,
  },
  dateText: {
    fontSize: '12px',
    color: '#adb5bd',
    margin: 0,
  }
};