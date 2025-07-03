
import { useState, useEffect } from 'react';
import { checkAPIHealth } from '../services/apiClient';

export const APIStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const healthy = await checkAPIHealth();
      setIsConnected(healthy);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isChecking) return 'bg-yellow-100 text-yellow-800';
    if (isConnected === null) return 'bg-gray-100 text-gray-800';
    return isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = () => {
    if (isChecking) return 'Checking...';
    if (isConnected === null) return 'Unknown';
    return isConnected ? 'Connected' : 'Disconnected';
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg" data-testid="api-status">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          isConnected ? 'bg-green-500' : 
          isConnected === false ? 'bg-red-500' : 'bg-gray-400'
        }`} />
        <span className="text-sm font-medium">API Status:</span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor()}`} data-testid="api-status-text">
          {getStatusText()}
        </span>
      </div>
      <button
        onClick={checkConnection}
        disabled={isChecking}
        className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isChecking ? 'Checking...' : 'Refresh'}
      </button>
    </div>
  );
};