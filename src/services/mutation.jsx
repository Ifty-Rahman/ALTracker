import { gql } from "@apollo/client";

// Mutation to update anime progress and score
export const UPDATE_ANIME_ENTRY = gql`
  mutation UpdateMediaListEntry($id: Int, $progress: Int, $score: Float) {
    SaveMediaListEntry(id: $id, progress: $progress, scoreRaw: $score) {
      id
      progress
      score
    }
  }
`;
