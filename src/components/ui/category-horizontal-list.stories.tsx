import { useState } from "react";
import type { Category, ContentType } from "oa-shared";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CategoryHorizontalList } from "./category-horizontal-list";

const categories: Category[] = [
  {
    id: 1,
    createdAt: new Date("2022-12-01T18:03:51.313Z"),
    modifiedAt: null,
    name: "Machines",
    type: "questions" as ContentType,
    imageUrl: null,
    description: "Machine projects",
  },
  {
    id: 2,
    createdAt: new Date("2022-12-03T18:03:51.313Z"),
    modifiedAt: null,
    name: "Moulds",
    type: "questions" as ContentType,
    imageUrl: null,
    description: null,
  },
  {
    id: 3,
    createdAt: new Date("2022-12-04T18:03:51.313Z"),
    modifiedAt: null,
    name: "Recycling",
    type: "questions" as ContentType,
    imageUrl: null,
    description: null,
  },
];

const meta: Meta<typeof CategoryHorizontalList> = {
  title: "ui/CategoryHorizontalList",
  component: CategoryHorizontalList,
};

export default meta;

type Story = StoryObj<typeof CategoryHorizontalList>;

export const Default: Story = {
  render: () => {
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);

    return (
      <CategoryHorizontalList
        activeCategory={activeCategory}
        allCategories={categories}
        setActiveCategory={setActiveCategory}
      />
    );
  },
};
