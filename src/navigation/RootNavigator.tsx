import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthStack } from './AuthStack';
import { StackNav } from './StackNav';

export const RootNavigator = () => {
  const { isAuthenticated } = useAuth();

  // If the user is authenticated, show the main app
  // Otherwise, show the Login/Register flow
  return isAuthenticated ? <StackNav /> : <AuthStack />;
};
