export interface IUser {
  avatar?: String;
  created?: Date;
  lastLogin?: Date;
  displayName?: String;
  photoURL?: String;
  email: String;
  isActive?: Boolean;
  profile?: IProfile;
  uid: String;
}

export interface IProfile {
  company?: String;
  fname?: String;
  lname?: String;
  website?: String;
}
