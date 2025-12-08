import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, users as staticUsers, UserRole } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Store for accessing DataStore users from AuthContext
let dataStoreRef: { users: User[] } | null = null;

export const setDataStoreRef = (ref: { users: User[] }) => {
  dataStoreRef = ref;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const getAllUsers = useCallback((): User[] => {
    const staticUsersList = staticUsers;
    const dynamic = dataStoreRef?.users || [];
    // Combine and deduplicate by id
    const allUsers = [...staticUsersList];
    dynamic.forEach(dynamicUser => {
      if (!allUsers.find(u => u.id === dynamicUser.id)) {
        allUsers.push(dynamicUser);
      }
    });
    return allUsers;
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const allUsers = getAllUsers();
    const foundUser = allUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  }, [getAllUsers]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const allUsers = getAllUsers();
    const userWithRole = allUsers.find(u => u.role === role);
    if (userWithRole) {
      setUser(userWithRole);
    }
  }, [getAllUsers]);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      switchRole,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
