import { Stack } from 'expo-router';
import React from 'react';

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
