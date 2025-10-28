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
