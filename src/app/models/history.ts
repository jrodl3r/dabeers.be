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
  [key: string]: IVoteItem; // beer-id
  // info: IVoteInfo; // beer-id
}

export interface IVoteItem {
  [key: string]: IVote;
}

export interface IVote {
  created: Date;
  email: String;
  uid: String;
  vote: Boolean;
}

// export interface IVoteInfo {
//   created: Date;
//   finished: Date;
//   id: String;
// }

export interface IBeerScores {
  [key: string]: number; // beer-id
}
