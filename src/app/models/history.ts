// user history
export interface IUserHistory {
  [key: string]: IUserHistoryItem; // user-id
}

export interface IUserHistoryItem {
  email: String;
  lastLogin: Date;
  uid: String;
}

// vote results
export interface IVoteHistoryItem {
  created: Date;
  finished: Date;
  id: String;
  votes: IVotes;
}

export interface IVotes {
  [key: string]: IVoteItem | IVoteInfo; // beer-id
}

export interface IVoteInfo {
  created: Date;
  finished: Date;
  id: String;
}

export interface IVoteItem {
  votes: Array<IVote>;
}

export interface IVote {
  created: Date;
  email: String;
  uid: String;
  vote: Boolean;
}
