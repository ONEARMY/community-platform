export interface ITutorial {
  workspace_name: string;
  cover_picture_url: string;
  title: string;
  description: string;
  details: Idetails[];
  steps: Istep[];
  id: string;
  slug: string;
}

interface Idetails {
  difficulty_level: "easy" | "medium" | "difficult";
  time: number;
  cost: number;
}

interface Istep {
  images?: string[];
  title: string;
  text: string;
}
