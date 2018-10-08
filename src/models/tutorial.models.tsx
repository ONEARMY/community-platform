export interface ITutorial {
  workspace_name: string;
  cover_picture_url: string;
  title: string;
  description: string;
  difficulty_level: "easy" | "medium" | "difficult";
  time: number;
  cost: number;
  steps: Istep[];
  id: string;
  slug: string;
}

interface Istep {
  images: string[];
  title: string;
  text: string;
}
