import { useState, useRef, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import "../css/StatusDropdown.css";

function StatusDropdown({ onStatusSelect, currentStatus = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const dropdownRef = useRef(null);

  const statusOptions = [
    "Watching",
    "Completed",
    "Plan to Watch",
    "On-Hold",
    "Dropped",
    "Rewatching",
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    setIsOpen(false);
    if (onStatusSelect) {
      onStatusSelect(status);
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="status-dropdown-container" ref={dropdownRef}>
      <button
        className="status-dropdown-button"
        onClick={toggleDropdown}
        aria-label="Status menu"
      >
        <BsThreeDots size={25} />
      </button>

      {isOpen && (
        <div className="status-dropdown-menu">
          {statusOptions.map((status) => (
            <div
              key={status}
              className={`status-dropdown-item ${selectedStatus === status ? "selected" : ""}`}
              onClick={() => handleStatusClick(status)}
            >
              {status}
              {selectedStatus === status && (
                <span className="status-checkmark">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatusDropdown;
