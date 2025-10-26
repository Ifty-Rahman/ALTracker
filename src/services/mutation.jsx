import { gql } from "@apollo/client";

// Mutation to update anime progress and score
export const UPDATE_ANIME_ENTRY = gql`
  mutation UpdateMediaListEntry($mediaId: Int, $progress: Int) {
    SaveMediaListEntry(mediaId: $mediaId, progress: $progress) {
      id
      progress
      status
      updatedAt
    }
  }
`;
