import "@testing-library/jest-dom/vitest";
import { act, screen, render } from "@testing-library/react";
import { Text } from "theme-ui";
import { describe, expect, it } from "vitest";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { queryAllByText } from "node_modules/storybook/dist/test";
import { User } from "node_modules/lucide-react/dist/lucide-react";

describe("Accordion", () => {
  it("displays the accordion body on click", () => {
    const { getByText } = render(
      <Accordion>
        <AccordionItem>
          <AccordionTrigger
            title="Accordion Title"
            subtitle="Accordion subtitle"
          />
          <AccordionContent>Now you see me!</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const accordionTrigger = getByText("Accordion Title");
    expect(screen.queryByText("Now you see me!")).not.toBeInTheDocument();

    act(() => {
      accordionTrigger.click();
    });

    expect(getByText("Now you see me!")).toBeInTheDocument();
  });
});

describe("Accordion", () => {
  it("allows multiple items to be expanded", () => {
    const { getByText } = render(
      <Accordion multiple>
        <AccordionItem>
          <AccordionTrigger title="First Item Title" />
          <AccordionContent>Now you see first item</AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionTrigger title="Second Item Title" />
          <AccordionContent>Now you see second item</AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionTrigger title="Third Item Title" />
          <AccordionContent>Now you see third item</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const accordionTriggers = [
      getByText("First Item Title"),
      getByText("Second Item Title"),
      getByText("Third Item Title"),
    ];
    const accordionContents = [
      "Now you see first item",
      "Now you see second item",
      "Now you see third item",
    ];

    for (const content of accordionContents) {
      expect(screen.queryByText(content)).not.toBeInTheDocument();
    }

    for (const trigger of accordionTriggers) {
      act(() => {
        trigger.click();
      });
    }

    for (const content of accordionContents) {
      expect(screen.queryByText(content)).toBeInTheDocument();
    }
  });
});
