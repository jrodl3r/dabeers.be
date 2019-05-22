export interface IPoll {
  [key: string]: IVotes; // beer-id
}

export interface IPollInfo {
  created: Date;
  finished: Date;
  id: String;
  status: [IPollStatusItems];
}

interface IPollStatusItems {
  [key: string]: IPollStatus; // beer-id
}

interface IPollStatus {
  active: Boolean;
}

export interface IPollResult extends IPollInfo {
  poll: IPoll;
}

interface IVotes {
  [key: string]: IVote; // user-id
}

export interface IVote {
  created: Date;
  email: String;
  uid: String;
  vote: Boolean;
}
