import React from 'react';
import Navigation from './components/Navigation';
import {AuthProvider} from './context/AuthContext';
import {SocketProvider} from './context/SocketContext';
import { RootSiblingParent } from 'react-native-root-siblings';

const App = () => {
  return (
    <RootSiblingParent> 
    <AuthProvider>
      <SocketProvider>
          <Navigation />
      </SocketProvider>
    </AuthProvider>
    </RootSiblingParent>
  );
};

export default App;
