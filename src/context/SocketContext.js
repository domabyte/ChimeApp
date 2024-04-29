import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("https://memberqa.actpal.com/");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = ({ userId, friendId }, callback) => {
    socket.emit('joinRoom', { userId, friendId }, ({ success, roomId }) => {
      if (success) {
        console.log(`Joined room ${roomId}`);
        callback();
      } else {
        console.error('Failed to join room');
        return false;
      }
    });
  };

  const leaveRoom = ({ userId, friendId }) => {
    console.log("Leaving room trigger");
    socket.emit('leaveRoom', { userId, friendId }, ({ success }) => {
      if (success) {
        console.log(`Left room`);
      } else {
        console.error('Failed to leave room');
      }
    });
  };

  return (
    <SocketContext.Provider value={{ socket, joinRoom, leaveRoom }}>
      {socket ? children : null}
    </SocketContext.Provider>
  );
};

export default SocketContext;
