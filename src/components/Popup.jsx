import React from "react";
import "../css/Popup.css";

function Popup({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default Popup;
