import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartLine, faUser, faEnvelope, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-item">
        <Link to="/">
          <FontAwesomeIcon icon={faHome} className="icon" />
        </Link>
      </div>
      <div className="sidebar-item">
        <Link to="/market">
          <FontAwesomeIcon icon={faChartLine} className="icon" />
        </Link>
      </div>
      <div className="sidebar-item">
        <Link to="/portfolio">
          <FontAwesomeIcon icon={faBriefcase} className="icon" />
        </Link>
      </div>
      <div className="sidebar-item">
        <Link to="/messages">
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
        </Link>
      </div>
      <div className="sidebar-item">
        <Link to="/profile">
          <FontAwesomeIcon icon={faUser} className="icon" />
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
