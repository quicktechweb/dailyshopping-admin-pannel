// TrackOrder.jsx
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const TrackOrder = () => {
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingType, setTrackingType] = useState('invoice'); // 'invoice', 'cid', 'trackingCode'
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
const API_KEY = 'hcpm2ucs22epe7q0j4qqaqagqf2y4yx7';
  const SECRET_KEY = '56onyth1a4rwfceproj6ao1o';
  const STEADFAST_URL = 'https://portal.packzy.com/api/v1';

  const handleTrack = async () => {
    if (!trackingInput.trim()) {
      return Swal.fire('Error', 'Please enter a value', 'error');
    }

    setLoading(true);
    setStatus(null);

    try {
      let url = '';
      switch (trackingType) {
        case 'invoice':
          url = `${STEADFAST_URL}/status_by_invoice/${trackingInput}`;
          break;
        case 'cid':
          url = `${STEADFAST_URL}/status_by_cid/${trackingInput}`;
          break;
        case 'trackingCode':
          url = `${STEADFAST_URL}/status_by_trackingcode/${trackingInput}`;
          break;
        default:
          break;
      }

      const res = await axios.get(url, {
        headers: {
          'Api-Key': API_KEY,
          'Secret-Key': SECRET_KEY
        }
      });

      if (res.data && res.data.delivery_status) {
        setStatus(res.data.delivery_status);
      } else {
        setStatus('Unknown');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to fetch tracking status. Check console.', 'error');
      setStatus('Error fetching status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-xl font-semibold mb-4">Track Your Order</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Tracking Type:</label>
        <select 
          value={trackingType} 
          onChange={e => setTrackingType(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          {/* <option value="invoice">Invoice</option> */}
          <option value="cid">Consignment ID</option>
          <option value="trackingCode">Tracking Code</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Enter Value:</label>
        <input 
          type="text" 
          value={trackingInput} 
          onChange={e => setTrackingInput(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter invoice, CID, or tracking code"
        />
      </div>

      <button 
        onClick={handleTrack}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Tracking...' : 'Track Order'}
      </button>

      {status && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-center">
          <span className="font-semibold">Status:</span> {status}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
