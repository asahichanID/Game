import React, { useEffect, useState } from 'react';
import { RoutePath } from './routes';
import { HomePage } from '../pages/HomePage';
import { CharacterPage } from '../pages/CharacterPage';
import { TrainingPage } from '../pages/TrainingPage';
import { RacePage } from '../pages/RacePage';
import { StoryPage } from '../pages/StoryPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';
import { SandboxPage } from '../pages/SandboxPage';
import { EndpointManager } from '../core/EndpointManager';
import { UIManager } from '../core/UIManager';

interface AppRouterProps {
  currentRoute: RoutePath;
  onRouteChange: (route: RoutePath) => void;
}

export const AppRouter: React.FC<AppRouterProps> = ({ currentRoute, onRouteChange }) => {
  useEffect(() => {
    // Parse token from query param if available: e.g. ?token=xyz
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (token) {
        EndpointManager.loginWithMainAppToken(token).then((res) => {
          if (res.success) {
            UIManager.showToast('Main Web App Linked', 'Token autentikasi berhasil dimuat!', 'success');
          }
        });
      }
    }
  }, []);

  const renderPage = () => {
    switch (currentRoute) {
      case 'home':
      case 'training':
        return <HomePage onNavigate={onRouteChange} />;
      case 'race':
        return <RacePage onNavigate={onRouteChange} />;
      case 'story':
        return <StoryPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'sandbox':
        return <SandboxPage />;
      default:
        return <HomePage onNavigate={onRouteChange} />;
    }
  };

  return <div className="animate-fade-in">{renderPage()}</div>;
};
