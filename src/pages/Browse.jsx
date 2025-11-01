import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Pagination } from "@mui/material";
import AnimeCard from "../components/AnimeCard";
import { TrophySpin } from "react-loading-indicators";
import {
  GET_TRENDING_ANIME,
  GET_POPULAR_ANIME,
  GET_POPULAR_SEASONAL_ANIME,
  GET_UPCOMING_SEASONAL_ANIME,
} from "../services/queries";
import "../css/Browse.css";

function Browse() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section") || "trending";
  const [page, setPage] = useState(1);
  const perPage = 24;

  useEffect(() => {
    setPage(1);
  }, [section]);

  const { query, variables } = getQueryAndVars(section, page, perPage);
  const { loading, error, data } = useQuery(query, {
    variables,
    fetchPolicy: "network-only",
  });

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="loading-indicator">
        <TrophySpin color="#6e35ff" size="large" />
      </div>
    );
  if (error) return <p className="error-msg">Error: {error.message}</p>;

  const anime = data?.Page?.media || [];
  const pageInfo = data?.Page?.pageInfo;

  function getQueryAndVars(section, page, perPage) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    let season = "WINTER";
    if (month >= 3 && month <= 5) season = "SPRING";
    else if (month >= 6 && month <= 8) season = "SUMMER";
    else if (month >= 9 && month <= 11) season = "FALL";

    switch (section) {
      case "popular":
        return {
          query: GET_POPULAR_ANIME,
          variables: { page, perPage, sort: ["POPULARITY_DESC"] },
        };
      case "seasonal":
        return {
          query: GET_POPULAR_SEASONAL_ANIME,
          variables: {
            page,
            perPage,
            sort: ["POPULARITY_DESC"],
            season,
            seasonYear: year,
          },
        };
      case "upcoming": {
        const nextSeason = getNextSeason(season);
        const nextYear = season === "FALL" ? year + 1 : year;
        return {
          query: GET_UPCOMING_SEASONAL_ANIME,
          variables: {
            page,
            perPage,
            sort: ["POPULARITY_DESC"],
            season: nextSeason,
            seasonYear: nextYear,
          },
        };
      }
      default:
        return {
          query: GET_TRENDING_ANIME,
          variables: { page, perPage, sort: ["TRENDING_DESC"] },
        };
    }
  }

  function getNextSeason(current) {
    const order = ["WINTER", "SPRING", "SUMMER", "FALL"];
    const index = order.indexOf(current);
    return order[(index + 1) % 4];
  }

  function getSectionTitle(section) {
    switch (section) {
      case "trending":
        return "Trending Now";
      case "popular":
        return "All Time Popular";
      case "seasonal":
        return "Popular This Season";
      case "upcoming":
        return "Upcoming Next Season";
      default:
        return "Browse Anime";
    }
  }

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h1 className="browse-title">{getSectionTitle(section)}</h1>
        <p className="browse-subtitle">
          Page {page} of {pageInfo?.lastPage || 1}
        </p>
      </div>

      <div className="browse-grid">
        {anime.map((item) => (
          <AnimeCard key={item.id} anime={item} />
        ))}
      </div>

      {pageInfo && pageInfo.lastPage > 1 && (
        <div className="browse-pagination">
          <Pagination
            count={pageInfo.lastPage}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#cfd8e3",
                fontSize: "1rem",
                fontWeight: 500,
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#6e35ff",
                color: "white",
                "&:hover": { backgroundColor: "#5725cc" },
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "rgba(110, 53, 255, 0.2)",
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Browse;
