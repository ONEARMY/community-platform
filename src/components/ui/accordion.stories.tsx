import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "./accordion";
import { ThemeProvider } from "@theme-ui/core";
import { theme } from "oa-themes";

const meta = {
  title: "ui/Accordion",
  component: Accordion,
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = (
  <>
    <ThemeProvider theme={theme}>
      <AccordionItem value="item-1">
        <AccordionTrigger
          title="Is it accessible?"
          subtitle="Accordion Accessibility"
        />
        <AccordionContent>
          Yes. It follows the WAI-ARIA accordion pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger title="Is it styled?" />
        <AccordionContent>
          Yes. It comes with default styles that match the other components.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger
          title="Is it animated?"
          subtitle="Height transition on open/close"
        />
        <AccordionContent>
          Yes, panels animate open and closed.
        </AccordionContent>
      </AccordionItem>
    </ThemeProvider>
  </>
);

export const Default: Story = {
  render: (args) => <Accordion {...args}>{items}</Accordion>,
};

export const Multiple: Story = {
  args: { multiple: true },
  render: (args) => <Accordion {...args}>{items}</Accordion>,
};

export const WithoutSubtitle: Story = {
  render: (args) => (
    <ThemeProvider theme={theme}>
      <Accordion {...args}>
        <AccordionItem>
          <AccordionTrigger title="Accordion without subtitle" />
          <AccordionContent>
            This Accordion variation renders an Accordion without a subtitle
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ThemeProvider>
  ),
};

export const DisabledItem: Story = {
  render: (args) => (
    <ThemeProvider theme={theme}>
      <Accordion {...args}>
        <AccordionItem value="item-1">
          <AccordionTrigger title="Enabled item" />
          <AccordionContent>This one opens normally.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" disabled>
          <AccordionTrigger
            title="Disabled item"
            subtitle="Cannot be toggled"
          />
          <AccordionContent>You should not see this.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </ThemeProvider>
  ),
};
