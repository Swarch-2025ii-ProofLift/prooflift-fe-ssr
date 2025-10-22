import { gql } from "@apollo/client";

export interface Post {
  id: string
  userId: string
  body: string
  exerciseIds: string[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  postId: string
  userId: string
  body: string
  createdAt: string
  updatedAt: string
}

export interface Reaction {
  id: string
  postId: string
  userId: string
  type: ReactionType
  createdAt: string
  updatedAt: string
}

export type ReactionType = 'LIKE' | 'LOVE' | 'STRONG' | 'FIRE' | 'CLAP'

export interface ReactionsByType {
  type: ReactionType
  count: number
}

export interface AggregatedPost {
  post: Post
  totalComments: number
  totalReactions: number
  reactionsByType: ReactionsByType[]
  currentUserReaction: Reaction | null
}

export interface GetPostDetailData {
  getAggregatedPostById: AggregatedPost
  getCommentsForPost: Comment[]
  getReactionsForPost: Reaction[]
}

export interface GetAggregatedPostsData {
  getAggregatedPost: AggregatedPost[]
}

export const GET_AGGREGATED_POSTS = gql`
  query GetAggregatedPosts($skip: Int, $limit: Int) {
    getAggregatedPost(skip: $skip, limit: $limit) {
      post {
        id
        userId
        body
        exerciseIds
        createdAt
        updatedAt
      }
      totalComments
      totalReactions
      reactionsByType {
        type
        count
      }
      currentUserReaction {
        id
        type
        userId
      }
    }
  }
`;

export const GET_POST_DETAIL = gql`
  query GetPostDetail($postId: UUID!, $skip: Int = 0, $limit: Int = 100) {
    getAggregatedPostById(postId: $postId) {
      post {
        id
        body
        userId
        exerciseIds
        createdAt
        updatedAt
      }
      totalComments
      totalReactions
      reactionsByType {
        type
        count
      }
      currentUserReaction {
        id
        type
        userId
      }
    }

    getCommentsForPost(postId: $postId, skip: $skip, limit: $limit) {
      id
      body
      userId
      createdAt
      updatedAt
    }

    getReactionsForPost(postId: $postId) {
      id
      postId
      userId
      type
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($postId: UUID!, $body: String, $exerciseIds: [String!]) {
    updatePost(postId: $postId, body: $body, exerciseIds: $exerciseIds) {
      id
      userId
      body
      exerciseIds
      updatedAt
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: UUID!) {
    deletePost(postId: $postId) {
      id
      userId
      body
      exerciseIds
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($body: String!, $exerciseIds: [String!]) {
    createPost(body: $body, exerciseIds: $exerciseIds) {
      id
      userId
      body
      exerciseIds
      createdAt
      updatedAt
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($postId: UUID!, $body: String!) { 
    addComment(postId: $postId, body: $body) { 
      id 
      postId 
      userId 
      body 
      createdAt 
      updatedAt 
    } 
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($commentId: UUID!, $body: String!) { 
    updateComment(commentId: $commentId, body: $body) { 
      id 
      postId 
      userId 
      body 
      createdAt 
      updatedAt 
    } 
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: UUID!) { 
    deleteComment(commentId: $commentId) { 
      id 
      postId 
      userId 
      body 
      createdAt 
      updatedAt 
    } 
  }
`;

export const SET_REACTION = gql`
  mutation SetReaction($postId: UUID!, $type: ReactionType!) { 
    setReaction(postId: $postId, type: $type) { 
      id 
      postId 
      userId 
      type 
      createdAt 
      updatedAt 
    } 
  }
`;

export const REMOVE_REACTION = gql`
  mutation RemoveReaction($postId: UUID!) { 
    removeReaction(postId: $postId) { 
      id 
      postId 
      userId 
      type 
      createdAt 
      updatedAt 
    } 
  }
`;