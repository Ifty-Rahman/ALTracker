import { gql } from "@apollo/client";

// Query to get the current logged-in user
export const GET_CURRENT_USER = gql`
  query {
    Viewer {
      id
      name
      avatar {
        large
      }
      bannerImage
    }
  }
`;

// Query to get top popular anime
export const GET_POPULAR_ANIME = gql`
  query {
    Page(perPage: 15) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
        }
      }
    }
  }
`;

// Query to get top trending anime
export const GET_TRENDING_ANIME = gql`
  query {
    Page(perPage: 15) {
      media(sort: TRENDING_DESC, type: ANIME) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
        }
      }
    }
  }
`;

// Query to get top popular anime for the current season
const now = new Date();
const month = now.getMonth() + 1;
const year = now.getFullYear();

let season = "WINTER";
if (month >= 3 && month <= 5) season = "SPRING";
else if (month >= 6 && month <= 8) season = "SUMMER";
else if (month >= 9 && month <= 11) season = "FALL";

export const GET_POPULAR_SEASONAL_ANIME = gql`
  query {
    Page(perPage: 15) {
      media(
        sort: POPULARITY_DESC
        type: ANIME
        season: ${season}
        seasonYear: ${year}
      ) {
        id
        title {
        english
        romaji
        }
        coverImage {
          large
        }
      }
    }
  }
`;

let nextSeason = "";
let nextYear = year;

if (season === "WINTER") {
  nextSeason = "SPRING";
} else if (season === "SPRING") {
  nextSeason = "SUMMER";
} else if (season === "SUMMER") {
  nextSeason = "FALL";
} else if (season === "FALL") {
  nextSeason = "WINTER";
  nextYear += 1;
}

// Query to get top upcoming anime for next season
export const GET_UPCOMING_SEASONAL_ANIME = gql`
  query {
    Page(perPage: 15) {
      media(
        sort: POPULARITY_DESC
        type: ANIME
        season: ${nextSeason}
        seasonYear: ${nextYear}
      ) {
        id
        title {
        english
        romaji
        }
        coverImage {
          large
        }
      }
    }
  }
`;

// Query to get a user's current anime list
export const GET_USER_ANIME_LIST = gql`
  query GetUserAnimeList($userName: String) {
    Viewer {
      id
      name
    }
    MediaListCollection(userName: $userName, type: ANIME) {
      lists {
        name
        entries {
          media {
            id
            title {
              english
              romaji
            }
            coverImage {
              large
            }
            episodes
          }
          score
          progress
        }
      }
    }
    User(name: $userName) {
      id
      mediaListOptions {
        scoreFormat
      }
    }
  }
`;

// Query to get user statistics
export const GET_USER_STATISTICS = gql`
  query Query {
    Viewer {
      id
      statistics {
        anime {
          count
          minutesWatched
          episodesWatched
          meanScore
          genres {
            count
            genre
          }
        }
        manga {
          count
          chaptersRead
          meanScore
          volumesRead
          genres {
            count
            genre
          }
        }
      }
    }
  }
`;

// Query to get the currently watching anime for a user
export const GET_CURRENTLY_WATCHING = gql`
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
              english
              romaji
            }
            coverImage {
              large
            }
            episodes
          }
        }
      }
    }
    User(name: $userName) {
      id
      mediaListOptions {
        scoreFormat
      }
    }
  }
`;

export const GET_USER_MEDIA_STATUS = gql`
  query GetUserMediaStatus($userId: Int, $mediaId: Int) {
    MediaList(userId: $userId, mediaId: $mediaId) {
      id
      status
    }
  }
`;
