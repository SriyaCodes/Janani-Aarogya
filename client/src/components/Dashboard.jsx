// src/components/Dashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputSection from './InputSection';

function Dashboard() {
  const [aiReply, setAiReply] = useState('');
  const navigate = useNavigate();

  const features = [
    {
      title: 'Memory Vault',
      desc: 'Capture and relive your motherhood journey.',
      img: 'https://via.placeholder.com/100',
      link: '/memory-vault',
    },
    {
      title: 'Maternal Yoga',
      desc: 'Curated yoga routines for each stage.',
      img: 'https://via.placeholder.com/100',
      link: '/yoga',
    },
    {
      title: 'Ayurveda',
      desc: 'Ayurvedic wisdom tailored for you.',
      img: 'https://via.placeholder.com/100',
      link: '/ayurveda',
    },
  ];

  return (
    <div className="min-h-screen bg-rose-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold text-pink-600">Janani Aarogya</h1>
        <div className="flex gap-6 text-sm font-medium">
          <button onClick={() => navigate('/memory-vault')} className="hover:text-pink-600">Memory Vault</button>
          <button onClick={() => navigate('/yoga')} className="hover:text-pink-600">Maternal Yoga</button>
          <button onClick={() => navigate('/ayurveda')} className="hover:text-pink-600">Ayurveda</button>
          <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">👤</div>
        </div>
      </nav>

      {/* Heading */}
      <div className="text-center mt-6 text-2xl font-semibold text-pink-700">
        Welcome to Janani Aarogya, your health companion
      </div>

      {/* Input Section */}
      <div className="mt-6 flex justify-center">
        <InputSection onReply={setAiReply} />
      </div>

      {/* AI Response */}
      {aiReply && (
        <div className="mt-4 mx-auto w-11/12 md:w-2/3 bg-white p-4 rounded-lg shadow text-gray-800">
          <strong>Janani Says:</strong>
          <div>{aiReply}</div>
        </div>
      )}

      {/* Feature Thumbnails */}
      <div className="mt-10 space-y-6 px-4 max-w-3xl mx-auto">
        {features.map(({ title, desc, img, link }) => (
          <div key={title} className="flex bg-white shadow-md rounded-lg overflow-hidden">
            <img src={img} alt={title} className="w-28 h-28 object-cover" />
            <div className="flex-1 p-4">
              <h3 className="text-lg font-semibold mb-1 text-pink-600">{title}</h3>
              <p className="text-sm text-gray-600 mb-2">{desc}</p>
              <button
                onClick={() => navigate(link)}
                className="text-sm font-medium text-white bg-pink-500 px-4 py-1.5 rounded hover:bg-pink-600"
              >
                Explore Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
