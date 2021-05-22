import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ChangePasswordInput = {
  token: Scalars['String'];
  password: Scalars['String'];
};

export type CreateGameInput = {
  title: Scalars['String'];
};

export type Game = {
  __typename?: 'Game';
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title: Scalars['String'];
  status: GameStatus;
  creator: User;
  meJoined: Scalars['Boolean'];
};

export enum GameStatus {
  Open = 'Open',
  Active = 'Active',
  Complete = 'Complete'
}

export type JoinGameInput = {
  id: Scalars['Int'];
  teamId: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createGame: Game;
  joinGame: Scalars['Boolean'];
  changePassword: User;
  forgotPassword: Scalars['Boolean'];
  login: User;
  logout: Scalars['Boolean'];
  register: User;
};


export type MutationCreateGameArgs = {
  input: CreateGameInput;
};


export type MutationJoinGameArgs = {
  input: JoinGameInput;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  input: UserLoginInput;
};


export type MutationRegisterArgs = {
  input: UserRegisterInput;
};

export type PaginationInput = {
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  game?: Maybe<Game>;
  games: Array<Game>;
  teams: Array<Team>;
  me?: Maybe<User>;
};


export type QueryGameArgs = {
  id: Scalars['Int'];
};


export type QueryGamesArgs = {
  input: PaginationInput;
};


export type QueryTeamsArgs = {
  input: TeamsInput;
};

export type Team = {
  __typename?: 'Team';
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  name: TeamName;
  manager?: Maybe<User>;
};

export enum TeamName {
  Eagles = 'Eagles',
  Redskins = 'Redskins',
  Giants = 'Giants',
  Colts = 'Colts',
  Steelers = 'Steelers',
  Bears = 'Bears',
  Rams = 'Rams',
  Cardinals = 'Cardinals',
  Packers = 'Packers',
  Lions = 'Lions'
}

export type TeamsInput = {
  gameId: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
};

export type UserLoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UserRegisterInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'email'>
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'User' }
    & UserFragment
  ) }
);

export type CreateGameMutationVariables = Exact<{
  title: Scalars['String'];
}>;


export type CreateGameMutation = (
  { __typename?: 'Mutation' }
  & { createGame: (
    { __typename?: 'Game' }
    & Pick<Game, 'id' | 'title'>
    & { creator: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type JoinGameMutationVariables = Exact<{
  id: Scalars['Int'];
  teamId: Scalars['Int'];
}>;


export type JoinGameMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'joinGame'>
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'User' }
    & UserFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'User' }
    & UserFragment
  ) }
);

export type GameQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GameQuery = (
  { __typename?: 'Query' }
  & { game?: Maybe<(
    { __typename?: 'Game' }
    & Pick<Game, 'id' | 'title' | 'createdAt' | 'updatedAt' | 'meJoined'>
    & { creator: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  )> }
);

export type GamesQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type GamesQuery = (
  { __typename?: 'Query' }
  & { games: Array<(
    { __typename?: 'Game' }
    & Pick<Game, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'status' | 'meJoined'>
    & { creator: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserFragment
  )> }
);

export type TeamsQueryVariables = Exact<{
  gameId: Scalars['Int'];
}>;


export type TeamsQuery = (
  { __typename?: 'Query' }
  & { teams: Array<(
    { __typename?: 'Team' }
    & Pick<Team, 'id' | 'name'>
    & { manager?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    )> }
  )> }
);

export const UserFragmentDoc = gql`
    fragment User on User {
  id
  username
  email
}
    `;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $password: String!) {
  changePassword(input: {token: $token, password: $password}) {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreateGameDocument = gql`
    mutation CreateGame($title: String!) {
  createGame(input: {title: $title}) {
    id
    title
    creator {
      id
      username
    }
  }
}
    `;

export function useCreateGameMutation() {
  return Urql.useMutation<CreateGameMutation, CreateGameMutationVariables>(CreateGameDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const JoinGameDocument = gql`
    mutation JoinGame($id: Int!, $teamId: Int!) {
  joinGame(input: {id: $id, teamId: $teamId})
}
    `;

export function useJoinGameMutation() {
  return Urql.useMutation<JoinGameMutation, JoinGameMutationVariables>(JoinGameDocument);
};
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(input: {email: $email, password: $password}) {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
  register(input: {username: $username, email: $email, password: $password}) {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const GameDocument = gql`
    query Game($id: Int!) {
  game(id: $id) {
    id
    title
    createdAt
    updatedAt
    creator {
      id
      username
    }
    meJoined
  }
}
    `;

export function useGameQuery(options: Omit<Urql.UseQueryArgs<GameQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GameQuery>({ query: GameDocument, ...options });
};
export const GamesDocument = gql`
    query Games($limit: Int!, $cursor: String) {
  games(input: {limit: $limit, cursor: $cursor}) {
    id
    createdAt
    updatedAt
    title
    status
    meJoined
    creator {
      id
      username
    }
  }
}
    `;

export function useGamesQuery(options: Omit<Urql.UseQueryArgs<GamesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GamesQuery>({ query: GamesDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const TeamsDocument = gql`
    query Teams($gameId: Int!) {
  teams(input: {gameId: $gameId}) {
    id
    name
    manager {
      id
      username
    }
  }
}
    `;

export function useTeamsQuery(options: Omit<Urql.UseQueryArgs<TeamsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TeamsQuery>({ query: TeamsDocument, ...options });
};