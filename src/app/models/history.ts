export interface IUserHistoryItem {
  email: String;
  lastLogin: Date;
}

export interface IUserHistory {
  [key: string]: IUserHistoryItem;
}
