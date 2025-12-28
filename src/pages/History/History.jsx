import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getScanHistory, deleteScan } from "../../services/database";
import HistorySection from "../../components/HistorySection";
import toast from "react-hot-toast";

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [user]);

  async function loadHistory() {
    setLoading(true);
    try {
      const data = await getScanHistory();
      setHistory(data || []);
    } catch (error) {
      console.error('Failed to load history:', error);
      toast.error('Failed to load scan history');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(scanId) {
    try {
      const result = await deleteScan(scanId);
      if (result.success) {
        setHistory(prev => prev.filter(item => item._id !== scanId));
        toast.success('Scan deleted');
      } else {
        toast.error('Failed to delete scan');
      }
    } catch (error) {
      console.error('Failed to delete scan:', error);
      toast.error('Failed to delete scan');
    }
  }

  async function handleClearAll() {
    try {
      const deletePromises = history.map(item => deleteScan(item._id));
      await Promise.all(deletePromises);
      setHistory([]);
      toast.success('All scans cleared');
    } catch (error) {
      console.error('Failed to clear history:', error);
      toast.error('Failed to clear history');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading history...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-300">Please log in to view your scan history</h2>
          <a href="/auth" className="text-indigo-400 hover:text-indigo-300 underline">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <HistorySection 
        history={history} 
        onDelete={handleDelete} 
        onClearAll={handleClearAll}
      />
    </div>
  );
}
