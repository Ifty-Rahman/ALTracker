import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_MEDIA_DETAILS } from "../services/Queries"; // You need a query for anime/manga details
import "../css/Details.css";

function Details() {
  const [searchParams] = useSearchParams();
  const id = parseInt(searchParams.get("id"));
  const type = searchParams.get("type"); // "ANIME" or "MANGA"

  const { loading, error, data } = useQuery(GET_MEDIA_DETAILS, {
    variables: { id, type },
  });

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error.message}</p>;

  const media = data.Media;

  return (
    <div className="details-page">
      <div className="details-header">
        <img
          src={media.coverImage.large}
          alt={media.title.romaji}
          className="cover-img"
        />
        <div className="details-info">
          <h1>{media.title.romaji}</h1>
          <p className="native-title">{media.title.native}</p>
          <p>
            <strong>Type:</strong> {media.type}
          </p>
          <p>
            <strong>Status:</strong> {media.status}
          </p>
          <p>
            <strong>Episodes/Chapters:</strong>{" "}
            {media.episodes || media.chapters}
          </p>
          <p>
            <strong>Genres:</strong> {media.genres.join(", ")}
          </p>
          <p>
            <strong>Average Score:</strong> {media.averageScore}%
          </p>
          <p className="description">
            {media.description.replace(/<[^>]+>/g, "")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Details;
