import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { api, type HealthResponse } from './api/client';

function HealthDashboard() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHealth();
      setHealth(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl p-8 border border-slate-700">
          <h1 className="text-2xl font-bold mb-2 text-white">Shelf System Check</h1>
          <p className="text-slate-400 text-sm mb-6">End-to-End Client & API Verification</p>

          {loading && (
              <div className="p-4 bg-slate-700/50 rounded-lg animate-pulse text-slate-300">
                Checking backend connection...
              </div>
          )}

          {error && (
              <div className="p-4 bg-red-950/50 border border-red-800 rounded-lg text-red-200">
                <p className="font-semibold">Connection Failed</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
          )}

          {health && (
              <div className="p-4 bg-emerald-950/50 border border-emerald-800 rounded-lg text-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-emerald-400">API Status:</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-900 text-emerald-100">
                {health.status.toUpperCase()}
              </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-emerald-400">Database:</span>
                  <span className="text-sm">{health.database}</span>
                </div>
                <div className="text-xs text-slate-400 pt-2 border-t border-emerald-900/50">
                  Last check: {new Date(health.timestamp).toLocaleTimeString()}
                </div>
              </div>
          )}

          <button
              onClick={checkConnection}
              className="mt-6 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg font-medium transition cursor-pointer text-white"
          >
            Recheck Connection
          </button>
        </div>
      </div>
  );
}

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HealthDashboard />} />
        </Routes>
      </BrowserRouter>
  );
}