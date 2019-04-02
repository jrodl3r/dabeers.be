export interface IUser {
  created?: Date;
  lastLogin?: any;
  displayName?: String;
  photoURL?: String;
  email: String;
  isActive?: Boolean;
  isAdmin?: Boolean;
  uid: String;
}
