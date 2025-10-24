import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useState } from "react";

// Query to get currently watching anime
const GET_CURRENTLY_WATCHING = gql`
  query GetCurrentlyWatching($userName: String) {
    MediaListCollection(userName: $userName, type: ANIME, status: CURRENT) {
      lists {
        entries {
          id
          mediaId
          status
          score
          progress
          media {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            episodes
          }
        }
      }
    }
  }
`;

// Query to get current user
const GET_VIEWER = gql`
  query {
    Viewer {
      id
      name
    }
  }
`;

// Mutation to update anime progress and score
const UPDATE_ANIME_ENTRY = gql`
  mutation UpdateMediaListEntry($id: Int, $progress: Int, $score: Float) {
    SaveMediaListEntry(id: $id, progress: $progress, scoreRaw: $score) {
      id
      progress
      score
    }
  }
`;

function Dashboard() {
  const [editingScore, setEditingScore] = useState({});
  const [tempScores, setTempScores] = useState({});

  const { data: viewerData } = useQuery(GET_VIEWER);
  const username = viewerData?.Viewer?.name;

  const { loading, error, data } = useQuery(GET_CURRENTLY_WATCHING, {
    variables: { userName: username },
    skip: !username,
  });

  const [updateAnime] = useMutation(UPDATE_ANIME_ENTRY, {
    refetchQueries: [
      {
        query: GET_CURRENTLY_WATCHING,
        variables: { userName: username },
      },
    ],
  });

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const entries = data?.MediaListCollection?.lists?.[0]?.entries || [];

  const handleProgressChange = (
    entryId,
    currentProgress,
    totalEpisodes,
    delta,
  ) => {
    const newProgress = Math.max(
      0,
      Math.min(totalEpisodes || 999, currentProgress + delta),
    );
    updateAnime({
      variables: {
        id: entryId,
        progress: newProgress,
      },
    });
  };

  const handleScoreEdit = (entryId) => {
    setEditingScore({ ...editingScore, [entryId]: true });
  };

  const handleScoreChange = (entryId, value) => {
    setTempScores({ ...tempScores, [entryId]: value });
  };

  const handleScoreSave = (entryId) => {
    const newScore = parseFloat(tempScores[entryId]);
    if (!isNaN(newScore) && newScore >= 0 && newScore <= 100) {
      updateAnime({
        variables: {
          id: entryId,
          score: newScore,
        },
      });
    }
    setEditingScore({ ...editingScore, [entryId]: false });
    setTempScores({ ...tempScores, [entryId]: undefined });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Currently Watching</h1>
      <div style={styles.grid}>
        {entries.map((entry) => (
          <div key={entry.id} style={styles.card}>
            <img
              src={entry.media.coverImage.large}
              alt={entry.media.title.romaji}
              style={styles.image}
            />
            <div style={styles.content}>
              <h3 style={styles.animeTitle}>
                {entry.media.title.english || entry.media.title.romaji}
              </h3>

              <div style={styles.progressSection}>
                <span style={styles.label}>Progress</span>
                <div style={styles.progressControls}>
                  <button
                    onClick={() =>
                      handleProgressChange(
                        entry.id,
                        entry.progress,
                        entry.media.episodes,
                        -1,
                      )
                    }
                    style={styles.button}
                    disabled={entry.progress <= 0}
                  >
                    −
                  </button>
                  <span style={styles.progressText}>
                    {entry.progress} / {entry.media.episodes || "?"}
                  </span>
                  <button
                    onClick={() =>
                      handleProgressChange(
                        entry.id,
                        entry.progress,
                        entry.media.episodes,
                        1,
                      )
                    }
                    style={styles.button}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={styles.scoreSection}>
                <span style={styles.label}>Score</span>
                {editingScore[entry.id] ? (
                  <div style={styles.scoreEdit}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={entry.score || 0}
                      onChange={(e) =>
                        handleScoreChange(entry.id, e.target.value)
                      }
                      style={styles.input}
                      placeholder="0-100"
                    />
                    <button
                      onClick={() => handleScoreSave(entry.id)}
                      style={styles.saveButton}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div style={styles.scoreDisplay}>
                    <span style={styles.scoreText}>
                      {entry.score || "Not rated"}
                    </span>
                    <button
                      onClick={() => handleScoreEdit(entry.id)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2rem",
    color: "#fff",
    marginBottom: "30px",
    fontWeight: "600",
  },
  loading: {
    color: "#fff",
    fontSize: "1.2rem",
    textAlign: "center",
    marginTop: "50px",
  },
  error: {
    color: "#ff6b6b",
    fontSize: "1.2rem",
    textAlign: "center",
    marginTop: "50px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: "10px",
    overflow: "hidden",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "default",
  },
  image: {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    display: "block",
  },
  content: {
    padding: "20px",
  },
  animeTitle: {
    fontSize: "1.1rem",
    color: "#fff",
    marginBottom: "15px",
    fontWeight: "600",
  },
  progressSection: {
    marginBottom: "15px",
  },
  label: {
    color: "#a1a1aa",
    fontSize: "0.9rem",
    display: "block",
    marginBottom: "8px",
  },
  progressControls: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  button: {
    width: "36px",
    height: "36px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#6e35ff",
    color: "#fff",
    fontSize: "1.2rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "500",
    minWidth: "80px",
    textAlign: "center",
  },
  scoreSection: {
    marginTop: "15px",
  },
  scoreEdit: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #3f3f46",
    backgroundColor: "#2a2a2a",
    color: "#fff",
    fontSize: "1rem",
  },
  saveButton: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#6e35ff",
    color: "#fff",
    fontSize: "0.9rem",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
  },
  scoreDisplay: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreText: {
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "500",
  },
  editButton: {
    padding: "6px 14px",
    borderRadius: "6px",
    border: "1px solid #6e35ff",
    backgroundColor: "transparent",
    color: "#6e35ff",
    fontSize: "0.85rem",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
};

export default Dashboard;
