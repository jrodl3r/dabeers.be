export interface IPollInfo {
  created: Date;
  finished: Date;
  id: String;
}

export interface IPollResult extends IPollInfo {
  poll: IPoll;
}

export interface IPoll {
  [key: string]: IVoteList; // beer-id
}

export interface IVoteList {
  [key: string]: IVote; // user-id
}

export interface IVote {
  created: Date;
  email: String;
  uid: String;
  vote: Boolean;
}
