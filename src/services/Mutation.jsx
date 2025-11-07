import { gql } from "@apollo/client";

// Mutation to update anime progress and score
export const UPDATE_ANIME_ENTRY = gql`
  mutation UpdateMediaListEntry($mediaId: Int, $progress: Int, $score: Float) {
    SaveMediaListEntry(mediaId: $mediaId, progress: $progress, score: $score) {
      id
      progress
      score
      status
      updatedAt
    }
  }
`;

// Mutation to update manga progress, volumes, and score
export const UPDATE_MANGA_ENTRY = gql`
  mutation UpdateMangaEntry(
    $mediaId: Int
    $progress: Int
    $progressVolumes: Int
    $score: Float
  ) {
    SaveMediaListEntry(
      mediaId: $mediaId
      progress: $progress
      progressVolumes: $progressVolumes
      score: $score
    ) {
      id
      progress
      progressVolumes
      score
      status
      updatedAt
    }
  }
`;

//update media status
export const SAVE_MEDIA_TO_LIST = gql`
  mutation SaveMediaToList($mediaId: Int!, $status: MediaListStatus!) {
    SaveMediaListEntry(mediaId: $mediaId, status: $status) {
      id
      mediaId
      status
      updatedAt
    }
  }
`;

export const DELETE_MEDIA_LIST_ENTRY = gql`
  mutation DeleteMediaListEntry($id: Int!) {
    DeleteMediaListEntry(id: $id) {
      deleted
    }
  }
`;

//add to favourtie
export const TOGGLE_FAVOURITE = gql`
  mutation ToggleFavourite($animeId: Int, $mangaId: Int) {
    ToggleFavourite(animeId: $animeId, mangaId: $mangaId) {
      anime {
        nodes {
          id
        }
      }
      manga {
        nodes {
          id
        }
      }
    }
  }
`;
