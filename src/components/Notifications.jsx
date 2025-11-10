import { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client/react";
import Badge from "@mui/material/Badge";
import { IoNotificationsSharp } from "react-icons/io5";
import { GET_NOTIFICATIONS } from "../services/Queries";
import "../css/Notifications.css";
import { useAuth } from "../contexts/AuthContext.js";

function Notifications() {
  const { authToken } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isRead, setIsRead] = useState(true);
  const [lastReadNotificationId, setLastReadNotificationId] = useState(null);
  const dropdownRef = useRef(null);
  const hasInitializedRef = useRef(false);

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
    fetchPolicy: "cache-first",
    skip: !authToken,
  });

  const showEmptyState =
    authToken &&
    !notificationLoading &&
    !notificationError &&
    notifications.length === 0;

  useEffect(() => {
    if (!authToken) {
      setNotifications([]);
      setIsRead(true);
      setLastReadNotificationId(null);
      setIsOpen(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (!notificationData) {
      return;
    }

    const fetchedNotifications = notificationData?.Page?.notifications || [];
    const newestNotificationId = fetchedNotifications[0]?.id ?? null;

    setNotifications(fetchedNotifications);

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setLastReadNotificationId(newestNotificationId);
      setIsRead(true);
      return;
    }

    if (
      !isOpen &&
      newestNotificationId &&
      newestNotificationId !== lastReadNotificationId
    ) {
      setIsRead(false);
    }
  }, [notificationData, isOpen, lastReadNotificationId]);

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!prev && next) {
        const newestNotificationId = notifications[0]?.id ?? null;
        setLastReadNotificationId(newestNotificationId);
        setIsRead(true);
      }
      return next;
    });
  };

  return (
    <div className="notifications" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="notifications__button"
        type="button"
        aria-label="Notifications"
      >
        <Badge
          color="error"
          overlap="circular"
          variant="dot"
          invisible={isRead}
        >
          <IoNotificationsSharp className="notification-icon" size={24} />
        </Badge>
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

            {!authToken && (
              <div className="notifications__state">
                Log in to view your notifications
              </div>
            )}

            {showEmptyState && (
              <div className="notifications__state">
                You're all caught up — no notifications yet
              </div>
            )}

            {authToken &&
              !notificationLoading &&
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
