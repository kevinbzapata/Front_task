import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  userToken: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  isLoading: false,
  signIn: async () => {},
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const authContext = {
    userToken,
    isLoading,
    signIn: async (email: string, password: string) => {
      setIsLoading(true);

      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserToken('dummy-token');
      setIsLoading(false);
    },
    signOut: () => {
      setUserToken(null);
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};