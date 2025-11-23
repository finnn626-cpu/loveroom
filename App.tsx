import React, { useState, useEffect } from 'react';
import { SpaceAuth } from './components/SpaceAuth';
import { ChatInterface } from './components/ChatInterface';
import { User, AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSpaceId, setCurrentSpaceId] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    try {
      const savedSession = sessionStorage.getItem('loveroom_session');
      if (savedSession) {
        try {
          const { user, spaceId } = JSON.parse(savedSession);
          if (user && spaceId) {
            setCurrentUser(user);
            setCurrentSpaceId(spaceId);
            setCurrentView(AppView.SPACE);
          }
        } catch (error) {
          console.error('Failed to parse session data:', error);
          sessionStorage.removeItem('loveroom_session');
        }
      }
    } catch (error) {
      console.error('Failed to access sessionStorage:', error);
    }
  }, []);

  const handleJoinSpace = (spaceId: string, user: User) => {
    setCurrentUser(user);
    setCurrentSpaceId(spaceId);
    setCurrentView(AppView.SPACE);
    
    // Save session for refresh
    try {
      sessionStorage.setItem('loveroom_session', JSON.stringify({ user, spaceId }));
    } catch (error) {
      console.error('Failed to save session to sessionStorage:', error);
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('loveroom_session');
    } catch (error) {
      console.error('Failed to remove session from sessionStorage:', error);
    }
    setCurrentUser(null);
    setCurrentSpaceId(null);
    setCurrentView(AppView.LANDING);
  };

  return (
    <div className="h-full w-full min-h-screen overflow-x-hidden">
      {currentView === AppView.LANDING && (
        <SpaceAuth onJoin={handleJoinSpace} />
      )}
      {currentView === AppView.SPACE && currentUser && currentSpaceId && (
        <ChatInterface 
          user={currentUser} 
          spaceId={currentSpaceId} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;