import { ITutorial } from "../models/tutorial.models";

export const TUTORIALS_MOCK: ITutorial[] = [
  {
    cover_picture_url: "myurl.com/myimage.jpeg",
    description: "this is a great description 1",
    details: [
      {
        cost: 20,
        difficulty_level: "difficult",
        time: 30
      }
    ],
    steps: [
      {
        images: ["myurl.com/myimage.jpeg", "myurl.com/myimage.jpeg"],
        text: "this text is wonderful oh my god",
        title: "My super step1 title"
      },
      {
        images: ["myurl.com/myimage.jpeg", "myurl.com/myimage.jpeg"],
        text: "this text is wonderful oh my god",
        title: "My super step2 title"
      }
    ],
    title: "Tutorial 1",
    workspace_name: "Eindhoven Mate",
    id: "fakeid1",
    slug: "tutorial-1"
  },
  {
    cover_picture_url: "myurl.com/myimage.jpeg",
    description: "this is a great description 2",
    details: [
      {
        cost: 20,
        difficulty_level: "difficult",
        time: 30
      }
    ],
    steps: [
      {
        images: ["myurl.com/myimage.jpeg", "myurl.com/myimage.jpeg"],
        text: "this text is wonderful oh my god",
        title: "My super step1 title"
      },
      {
        images: ["myurl.com/myimage.jpeg", "myurl.com/myimage.jpeg"],
        text: "this text is wonderful oh my god",
        title: "My super step2 title"
      }
    ],
    title: "Tutorial 2",
    workspace_name: "Eindhoven Mate",
    id: "fakeid2",
    slug: "tutorial-2"
  },
  {
    cover_picture_url: "myurl.com/myimage.jpeg",
    description: "this is a great description 3",
    details: [
      {
        cost: 20,
        difficulty_level: "difficult",
        time: 30
      }
    ],
    steps: [
      {
        images: ["myurl.com/myimage.jpeg", "myurl.com/myimage.jpeg"],
        text: "this text is wonderful oh my god",
        title: "My super step1 title"
      },
      {
        images: ["myurl.com/myimage.jpeg", "myurl.com/myimage.jpeg"],
        text: "this text is wonderful oh my god",
        title: "My super step2 title"
      }
    ],
    title: "Tutorial 3",
    workspace_name: "Eindhoven Mate",
    id: "fakeid3",
    slug: "tutorial-3"
  }
];
