// src/utils/detailsHelpers.js

export const LIST_STATUSES = [
  "CURRENT",
  "PLANNING",
  "COMPLETED",
  "PAUSED",
  "DROPPED",
  "REPEATING",
];

export const STATUS_LABELS = {
  CURRENT: { ANIME: "Currently Watching", MANGA: "Currently Reading" },
  PLANNING: { default: "Planning" },
  COMPLETED: { default: "Completed" },
  PAUSED: { default: "On Hold" },
  DROPPED: { default: "Dropped" },
  REPEATING: { ANIME: "Rewatching", MANGA: "Rereading", default: "Rewatching" },
};

export const toDisplayText = (label) =>
  label
    .toLowerCase()
    .split(" ")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

export const formatStatus = (status, mediaType) => {
  if (!status) return "";
  const formattedStatus = STATUS_LABELS[status];
  if (!formattedStatus) {
    return toDisplayText(status.replace(/_/g, " "));
  }
  if (typeof formattedStatus === "string") {
    return formattedStatus;
  }
  return (
    formattedStatus[mediaType] ||
    formattedStatus.default ||
    toDisplayText(status.replace(/_/g, " "))
  );
};

export const formatRelation = (relation) =>
  toDisplayText(relation.replace(/_/g, " "));
