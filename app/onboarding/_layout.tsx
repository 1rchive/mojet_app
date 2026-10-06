import { Stack } from 'expo-router'; // assuming Expo Router
import React from 'react';


const Layout: React.FC = () => {
  return (
    <Stack
      screenOptions={{
        animation: 'none',  // disable animation globally
        headerShown: false
      }}
    />
  );
};

export default Layout;
