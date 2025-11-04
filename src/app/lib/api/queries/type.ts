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
  quizzes: Quiz;
  questions: Question;
};

export type Option = {
  id: number;
  text: string;
  value?: number | null;
  isKey?: boolean | null;
};

export type Question = {
  id: number;
  quizId: number;
  text: string;
  type: string;
  order: number;
  weight?: number | null;
  language?: string | null;
  options: Option[];
};

export type Quiz = {
  id: number;
  title: string;
  description?: string | null;
  isActive: boolean;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
};
