import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import "../css/AnimeCard.css";

const GET_POPULAR_ANIME = gql`
  query {
    Page(perPage: 1) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        id
        title {
          romaji
        }
        coverImage {
          large
        }
      }
    }
  }
`;

function AnimeCard() {
  const { loading, error, data } = useQuery(GET_POPULAR_ANIME);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const anime = data.Page.media[0];

  return (
    <div className="anime-card">
      <img
        src={anime.coverImage.large}
        alt={anime.title.romaji}
        className="anime-image"
      />
      <h3 className="anime-title">{anime.title.romaji}</h3>
    </div>
  );
}

export default AnimeCard;
