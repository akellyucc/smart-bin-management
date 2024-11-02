import React, { useState } from 'react';
import '../styles/Header.css';
import { Link } from 'react-router-dom';

const Header = ({ onParishChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');

  const countries = [
    { name: 'Jamaica', parishes: ['Portmore', 'Kingston', 'St. Andrew', 'St. Catherine', 'Clarendon', 'Manchester', 'St. Elizabeth', 'Westmoreland', 'Hanover', 'St. James', 'Trelawny', 'St. Ann', 'St. Mary'] },
    { name: 'USA', parishes: [] }
  ];

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false); // Close dropdown
  };
  console.log(selectedCountry);
  const handleParishChange = (parish) => {
    console.log('Selected Parish in Header:', parish); // Debugging
    onParishChange(parish); // Update the selected parish in the parent component
    setIsDropdownOpen(false); // Close dropdown
    setIsSubmenuOpen(false); // Close submenu
  };

  return (
    <header className="header">
      <div className="branding">Smart Bin Management and Disposal System</div>
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link class="home_link"to="/">Home</Link> {/* Link to home page */}
          </li>
          <li className="nav-item">Bin Status</li>
          <li
            className="nav-item dropdown"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className="dropdown-toggle">Location</div>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {countries.map((country) => (
                  <div
                    key={country.name}
                    className="dropdown-item"
                    onMouseEnter={() => {
                      if (country.name === 'Jamaica') {
                        setIsSubmenuOpen(true);
                      }
                    }}
                    onMouseLeave={() => {
                      if (country.name === 'Jamaica') {
                        setIsSubmenuOpen(false);
                      }
                    }}
                    onClick={() => handleCountryChange(country.name)}
                  >
                    {country.name}
                    {country.name === 'Jamaica' && isSubmenuOpen && (
                      <div className="submenu">
                        {country.parishes.map((parish, index) => (
                          <div
                            key={index}
                            className="submenu-item"
                            onClick={() => handleParishChange(parish)}
                          >
                            {parish}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </li>
          <li className="nav-item">Route Management</li>
          <li className="nav-item">Reports</li>
          <li className="nav-item">Settings</li>
        </ul>
      </nav>
      <div className="user-profile">Profile</div>
    </header>
  );
};

export default Header;
