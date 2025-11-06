function DashboardEmptyState({ onRedirectToDiscover }) {
  return (
    <div className="dashboard-empty-state">
      <p>
        Nothing here yet. Discover new titles or use Search to add anime and
        manga to your list.
      </p>
      <div className="dashboard-empty-actions">
        <button type="button" onClick={onRedirectToDiscover}>
          Go to Discover
        </button>
      </div>
    </div>
  );
}

export default DashboardEmptyState;
