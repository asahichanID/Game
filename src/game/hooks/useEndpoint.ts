import { useState } from 'react';
import { EndpointManager } from '../../core/EndpointManager';

export function useEndpoint() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncMsg, setLastSyncMsg] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(EndpointManager.isMockMode());

  const loginWithToken = async (token: string) => {
    setIsSyncing(true);
    const res = await EndpointManager.loginWithMainAppToken(token);
    setLastSyncMsg(res.message);
    setIsSyncing(false);
    return res;
  };

  const syncCarrotCoins = async (amount: number, reason: string) => {
    setIsSyncing(true);
    const res = await EndpointManager.syncCarrotCoins(amount, reason);
    setLastSyncMsg(res.message);
    setIsSyncing(false);
    return res;
  };

  const performFullSync = async () => {
    setIsSyncing(true);
    const res = await EndpointManager.performFullSync();
    setLastSyncMsg(res.message);
    setIsSyncing(false);
    return res;
  };

  const toggleMockMode = (mock: boolean) => {
    EndpointManager.toggleMockMode(mock);
    setIsMock(mock);
  };

  return {
    isSyncing,
    lastSyncMsg,
    isMock,
    token: EndpointManager.getToken(),
    loginWithToken,
    syncCarrotCoins,
    performFullSync,
    toggleMockMode,
  };
}
