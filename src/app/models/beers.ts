export interface IBeer {
  id: String;
  title: String;
  description: String;
  image: String;
  created: Date;
  edited: Date;
  isActive: Boolean;
}

export interface IBeers {
  [key: string]: IBeer;
}
