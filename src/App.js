import React from 'react';
import Navigation from './components/Navigation';
import {AuthProvider} from './context/AuthContext';
import ChatSection from './messages/chatSection';
import AllMessages from './messages/all_messages';
import FindFriends from './Friends/find_Friends';
import MyFriends from './Friends/My_Friend';
import ReceivedRequest from './Friends/Received_Request';
import SentRequest from './Friends/sent_Request';
import SuggestedFriends from './Friends/suggestedFriends';
import Myprofile from './authentication/myProfile/myProfile';
import UserProfile from './authentication/myProfile/userProfile';


const App = () => {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  )
};

export default App;
