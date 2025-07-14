import React, { useState, useEffect } from 'react';
import { razorpayService } from '../../services/firebase';

export default function RazorpayConfig() {
  const [keyId, setKeyId] = useState('');
  const [keySecret, setKeySecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const config = await razorpayService.getKeys();
        if (config) {
          setKeyId(config.keyId || '');
          setKeySecret(config.keySecret || '');
        }
      } catch (err) {
        setMessage('⚠️ Failed to load keys.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchKeys();
  }, []);

  const handleSave = async () => {
    if (!keyId || !keySecret) {
      setMessage('Key ID and Secret are required.');
      return;
    }

    setSaving(true);
    try {
      await razorpayService.saveKeys(keyId, keySecret);
      setMessage('✅ Razorpay keys saved successfully.');
    } catch (err) {
      setMessage('❌ Failed to save keys.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-4 text-sm">Loading Razorpay config...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6 max-w-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Razorpay Configuration</h3>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Razorpay Key ID"
          value={keyId}
          onChange={(e) => setKeyId(e.target.value)}
          className="w-full px-4 py-2 border rounded text-sm"
        />
        <input
          type="password"
          placeholder="Razorpay Key Secret"
          value={keySecret}
          onChange={(e) => setKeySecret(e.target.value)}
          className="w-full px-4 py-2 border rounded text-sm"
        />
        {message && <p className="text-sm text-gray-700">{message}</p>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90 text-sm"
        >
          {saving ? 'Saving...' : 'Save Keys'}
        </button>
      </div>
    </div>
  );
}
