'use client';

import React from 'react';
import { FiHome, FiVideo, FiBarChart2, FiPlay, FiUsers, FiUpload, FiLayers, FiCpu, FiHash, FiTrendingUp, FiStar, FiSettings, FiClock } from 'react-icons/fi';
import { FaBrain, FaFire, FaHeart } from 'react-icons/fa';
import { RiFileHistoryFill } from 'react-icons/ri';
import { FaIdCardClip } from 'react-icons/fa6';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-base-200 text-base-content h-screen p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <FaFire className="text-primary text-3xl mr-2" />
        <span className="text-xl font-bold">valderlinde</span>
      </div>
      <ul className="menu p-0 space-y-2 flex-grow">
        <li>
          <a href="/" className="active">
            <FiHome className="text-xl" />
            Home
          </a>
        </li>
        <li>
          <a href="/consultations">
            <FiVideo className="text-xl" />
            Consultations
          </a>  
        </li>
        <li>
          <a>
            <FiClock className="text-xl" />
            History
          </a>
        </li>
        <li>
          <a href="/profile">
            <FaHeart className="text-xl" />
            My Patient Profile
          </a>
        </li>
        
      </ul>
      {/* <div className="divider"></div> */}
      {/* <ul className="menu p-0 space-y-2 flex-grow">
        <li>
          <a>
            <FiLayers className="text-xl" />
            Integrations
            <span className="badge badge-primary badge-sm">NEW</span>
          </a>
        </li>
        <li>
          <a>
            <FiCpu className="text-xl" />
            AI Apps
          </a>
        </li>
        <li>
          <a>
            <FiHash className="text-xl" />
            Topic Tracker
          </a>
        </li>
        <li>
          <a>
            <FiBarChart2 className="text-xl" />
            Analytics
          </a>
        </li>
      </ul> */}
      {/* <div className="divider"></div> */}
      <ul className="menu p-0 space-y-2">
        <li>
          <a>
            <FiUsers className="text-xl" />
            Account
          </a>
        </li>
        <li>
          <a>
            <FiStar className="text-xl" />
            Upgrade
          </a>
        </li>
        <li>
          <a>
            <FiSettings className="text-xl" />
            Settings
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
