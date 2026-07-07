export type Member = {
  name: string;
  role: string;
  accent: string;
  image: any;
  banner?: any;
  links?: {
    portfolio?: string;
    discord?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
};
