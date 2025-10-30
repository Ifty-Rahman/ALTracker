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

export const UPDATE_ANIME_STATUS = gql`
  mutation UpdateMediaListStatus($mediaId: Int, $status: MediaListStatus) {
    SaveMediaListEntry(mediaId: $mediaId, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

export const SAVE_ANIME_TO_LIST = gql`
  mutation SaveAnimeToList($mediaId: Int, $status: MediaListStatus) {
    SaveMediaListEntry(mediaId: $mediaId, status: $status) {
      id
      mediaId
      status
      updatedAt
    }
  }
`;
