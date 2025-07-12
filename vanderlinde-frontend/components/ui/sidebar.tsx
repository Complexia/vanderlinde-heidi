'use client';

import React from 'react';
import { FiHome, FiVideo, FiBarChart2, FiPlay, FiUsers, FiUpload, FiLayers, FiCpu, FiHash, FiTrendingUp, FiStar, FiSettings } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-base-200 text-base-content h-screen p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <FaFire className="text-primary text-3xl mr-2" />
        <span className="text-xl font-bold">valderlinde</span>
      </div>
      <ul className="menu p-0 space-y-2 flex-grow">
        <li>
          <a className="active">
            <FiHome className="text-xl" />
            Home
          </a>
        </li>
        <li>
          <a>
            <FiVideo className="text-xl" />
            Meetings
          </a>
        </li>
        <li>
          <a>
            <FiTrendingUp className="text-xl" />
            Meeting Status
          </a>
        </li>
        <li>
          <a>
            <FiPlay className="text-xl" />
            Playlist
          </a>
        </li>
        <li>
          <a>
            <FiUsers className="text-xl" />
            Contacts
          </a>
        </li>
        <li>
          <a>
            <FiUpload className="text-xl" />
            Uploads
          </a>
        </li>
      </ul>
      <div className="divider"></div>
      <ul className="menu p-0 space-y-2 flex-grow">
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
      </ul>
      <div className="divider"></div>
      <ul className="menu p-0 space-y-2">
        <li>
          <a>
            <FiUsers className="text-xl" />
            Team
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
