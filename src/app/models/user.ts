export interface IUser {
  created?: Date;
  lastActive?: any;
  lastLogin?: any;
  displayName?: String;
  photoURL?: String;
  email: String;
  isActive?: Boolean;
  isAdmin?: Boolean;
  uid: String;
}
