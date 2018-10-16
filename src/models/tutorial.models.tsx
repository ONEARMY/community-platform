export interface ITutorial {
  workspace_name: string;
  cover_image_url: string;
  tutorial_title: string;
  tutorial_description: string;
  difficulty_level: "easy" | "medium" | "difficult";
  tutorial_time: string;
  tutorial_cost: number;
  steps: ITutorialStep[];
  id: string;
  slug: string;
}

export interface ITutorialStep {
  images: string[];
  title: string;
  text: string;
}
