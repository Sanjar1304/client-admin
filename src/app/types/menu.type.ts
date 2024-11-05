export type MenuList = {
  title: string;
  icon: string;
  link?: string;
  children?: MenuListItem[];
};

export type MenuListItem = {
  title: string;
  icon: string;
  link: string;
};
