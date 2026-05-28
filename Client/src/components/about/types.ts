export type Member = {
  name: string;
  role: string;
  accent: string;
  image: string;
  links?: {
    portfolio?: string;
    discord?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
};
