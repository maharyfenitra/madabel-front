export type Profile = {
  id: number;
  name: string;
  description?: string | null;
  avatar: string;
  email: string;
};

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name?: string | null;
  };
  likes: {
    id: number;
    userId: number;
  }[];
};

export type Post = {
  id: number;
  content: string;
  title?: string | null;
  file?: string | null;
  thumbnail?: string | null;
  price?: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name?: string | null;
    avatar?: string | null;
  };
  likes: {
    id: number;
    userId: number;
  }[];
  comments: Comment[];
};

export type ModuleTypeMap = {
  profiles: Profile;
  posts: Post;
};
