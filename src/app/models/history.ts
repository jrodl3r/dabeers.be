export interface IUserHistoryItem {
  email: String;
  votes: Array<any>;
}

export interface IUserHistory {
  [key: string]: IUserHistoryItem;
}
