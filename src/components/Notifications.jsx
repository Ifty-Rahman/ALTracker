import { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { IoNotificationsSharp } from "react-icons/io5";
import { GET_NOTIFICATIONS } from "../services/Queries";
import "../css/Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const {
    loading: notificationLoading,
    error: notificationError,
    data: notificationData,
  } = useQuery(GET_NOTIFICATIONS, {
    variables: { page: 1, perPage: 15 },
    skip: !isOpen,
  });

  useEffect(() => {
    if (notificationData) {
      setNotifications(notificationData?.Page?.notifications || []);
    }
  }, [notificationData]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="notifications" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="notifications__button"
        type="button"
        aria-label="Notifications"
      >
        <IoNotificationsSharp color="var(--text)" size={24} />
      </button>

      {isOpen && (
        <div className="notifications__dropdown">
          <div className="notifications__header">
            <h3 className="notifications__title">Notifications</h3>
          </div>

          <div className="notifications__list">
            {notificationLoading && (
              <div className="notifications__state">
                Loading notifications...
              </div>
            )}

            {notificationError && (
              <div className="notifications__state notifications__state--error">
                Failed to load notifications
              </div>
            )}

            {!notificationLoading &&
              !notificationError &&
              notifications.length === 0 && (
                <div className="notifications__state">No notifications yet</div>
              )}

            {!notificationLoading &&
              !notificationError &&
              notifications.map((notification) => {
                if (notification.__typename === "AiringNotification") {
                  return (
                    <div key={notification.id} className="notifications__item">
                      <div className="notifications__item-content">
                        <div className="notifications__item-title">
                          {notification.media?.title?.romaji || "Unknown Title"}
                        </div>
                        <div className="notifications__item-subtitle">
                          Episode {notification.episode} aired
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
