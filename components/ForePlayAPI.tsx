import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// Initialize Apollo Client
export const forePlayClient = new ApolloClient({
    uri: 'https://fore-play-api-1eac9c288716.herokuapp.com/graphql',
    cache: new InMemoryCache()
  });
  
export const GET_PROPOSALS = gql`
    query GetProposals {
      proposals {
        id
        proposalDate
        userId
      }
    }
  `;

  export const GET_APPROVED = gql`
    query GetApproved {
      approvalsApproved {
        approval
        approvalDate
        id
        userId
      }
    }
  `;

export const ADD_PROPOSAL = gql`
  mutation Mutation($userId: String!, $proposalDate: Date!) {
    createProposal(userId: $userId, proposalDate: $proposalDate) {
      id
      proposalDate
      userId
    }
  }
`;
  
export const CREATE_APPROVAL = gql`
    mutation Mutation($userId: String!, $approvalDate: Date!, $approval: Boolean!) {
      createApproval(userId: $userId, approvalDate: $approvalDate, approval: $approval) {
        approval
        approvalDate
        id
        userId
      }
    }
  `;