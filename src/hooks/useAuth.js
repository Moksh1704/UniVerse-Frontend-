import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuth();
  }, []);

  const loadAuth = async () => {
    try {
      const [storedToken, storedUser] = await AsyncStorage.multiGet([
        'universe_token',
        'universe_user',
      ]);
      const tokenValue = storedToken[1];
      const userValue  = storedUser[1] ? JSON.parse(storedUser[1]) : null;
      if (tokenValue && userValue) {
        setToken(tokenValue);
        setUser(userValue);
      }
    } catch (e) {
      // ignore parse errors — treat as logged out
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (tokenValue, userValue) => {
    await AsyncStorage.setItem('universe_token', tokenValue);
    await AsyncStorage.setItem('universe_user', JSON.stringify(userValue));
    setToken(tokenValue);
    setUser(userValue);
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(['universe_token', 'universe_user']);
    setToken(null);
    setUser(null);
  };

  const updateUser = async (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    await AsyncStorage.setItem('universe_user', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
