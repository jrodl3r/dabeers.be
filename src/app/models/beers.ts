export interface IBeer {
  id: String;
  title: String;
  description: String;
  image: String;
  created: String;
  edited: String;
}

export interface IBeers {
  items: IBeer[];
}
