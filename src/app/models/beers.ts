export interface IBeer {
  title: String;
  description: String;
  image: String;
  created: Date;
  edited: Date;
  isActive: Boolean;
}

export interface IBeers {
  items: IBeer[];
}
