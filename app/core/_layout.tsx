import React from 'react';
import { Stack } from 'expo-router';

const Layout: React.FC = () => {
  return (
    <Stack
      screenOptions={{
        animation: 'none',  // default: no animation
        headerShown: false,
        
      }}
    >
    </Stack>
  );
};

export default Layout;
