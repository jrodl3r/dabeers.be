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
