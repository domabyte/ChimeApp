import React from 'react';
import Navigation from './components/Navigation';
import {AuthProvider} from './context/AuthContext';
import {SocketProvider} from './context/SocketContext';

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
          <Navigation />
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
