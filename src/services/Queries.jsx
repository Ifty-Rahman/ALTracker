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
  query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(type: ANIME, sort: $sort) {
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
  query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(type: ANIME, sort: $sort) {
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
export const GET_POPULAR_SEASONAL_ANIME = gql`
  query (
    $page: Int
    $perPage: Int
    $sort: [MediaSort]
    $season: MediaSeason
    $seasonYear: Int
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(
        type: ANIME
        sort: $sort
        season: $season
        seasonYear: $seasonYear
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

// Query to get top upcoming anime for next season
export const GET_UPCOMING_SEASONAL_ANIME = gql`
  query (
    $page: Int
    $perPage: Int
    $sort: [MediaSort]
    $season: MediaSeason
    $seasonYear: Int
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(
        type: ANIME
        sort: $sort
        season: $season
        seasonYear: $seasonYear
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
    MediaListCollection(
      userName: $userName
      type: ANIME
      status: CURRENT
      sort: UPDATED_TIME_DESC
    ) {
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

// Query to get the currently reading manga for a user
export const GET_CURRENTLY_READING = gql`
  query GetCurrentlyReading($userName: String) {
    MediaListCollection(
      userName: $userName
      type: MANGA
      status: CURRENT
      sort: UPDATED_TIME_DESC
    ) {
      lists {
        entries {
          id
          mediaId
          status
          score
          progress
          progressVolumes
          media {
            id
            title {
              english
              romaji
            }
            coverImage {
              large
            }
            chapters
            volumes
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

export const GET_SEARCH_DATA = gql`
  query ($search: String, $page: Int, $perPage: Int, $type: MediaType) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: $type) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
      }
    }
  }
`;
