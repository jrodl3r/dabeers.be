export interface IBeer {
  id: string;
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
