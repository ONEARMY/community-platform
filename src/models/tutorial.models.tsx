export interface ITutorial {
  workspace_name: string;
  cover_picture_url: string;
  title: string;
  description: string;
  difficulty_level: "easy" | "medium" | "difficult";
  time: number;
  cost: number;
  steps: ITutorialStep[];
  id: string;
  slug: string;
}

export interface ITutorialStep {
  images?: string[];
  title: string;
  text: string;
}
