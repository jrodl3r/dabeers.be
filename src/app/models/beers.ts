export interface IBeer {
  title: String;
  description: String;
  image: String;
  created: String;
  edited: String;
  isActive: Boolean;
}

export interface IBeers {
  items: IBeer[];
}
