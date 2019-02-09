export interface IBeer {
  id: string;
  title: string;
  description: string;
  created: string;
  edited: string;
}

export interface IBeers {
  items: IBeer[];
}
