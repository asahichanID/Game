import React, { useState } from 'react';
import { MainGameLayout } from './layouts/MainGameLayout';
import { AppRouter } from './router/AppRouter';
import { RoutePath } from './router/routes';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<RoutePath>('home');

  return (
    <MainGameLayout currentRoute={currentRoute} onRouteChange={setCurrentRoute}>
      <AppRouter currentRoute={currentRoute} onRouteChange={setCurrentRoute} />
    </MainGameLayout>
  );
}

