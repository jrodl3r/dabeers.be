export interface IUser {
  created?: Date;
  lastLogin?: Date;
  displayName?: String;
  photoURL?: String;
  email: String;
  isActive?: Boolean;
  isAdmin?: Boolean;
  uid: String;
}

export interface IUserProfiles {
  [key: string]: IUserProfile;
}

export interface IUserProfile {
  email: String;
  lastLogin: Date;
  uid: String;
}
