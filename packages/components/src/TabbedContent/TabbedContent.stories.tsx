import { faker } from '@faker-js/faker'
import { Box } from 'theme-ui'

import { Tab, TabPanel, Tabs, TabsList } from './TabbedContent'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/TabbedContent',
} as Meta

export const Default: StoryFn = () => {
  return (
    <Box
      sx={{
        background: 'white',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: 6,
      }}
    >
      <Tabs defaultValue={0}>
        <TabsList>
          <Tab>Tab #1</Tab>
          <Tab>Tab #2</Tab>
          <Tab>Tab #3</Tab>
          <Tab>Tab #4</Tab>
          <Tab>Tab #5</Tab>
        </TabsList>

        <TabPanel>
          <p>Tab Panel #1</p>
          <p>{faker.lorem.paragraphs(3)}</p>
        </TabPanel>
        <TabPanel>
          <p>Tab Panel #2</p>
          <p>{faker.lorem.paragraphs(3)}</p>
        </TabPanel>
        <TabPanel>
          <p>Tab Panel #3</p>
          <p>{faker.lorem.paragraphs(3)}</p>
        </TabPanel>
        <TabPanel>
          <p>Tab Panel #4</p>
          <p>{faker.lorem.paragraphs(3)}</p>
        </TabPanel>
        <TabPanel>
          <p>Tab Panel #5</p>
          <p>{faker.lorem.paragraphs(3)}</p>
        </TabPanel>
      </Tabs>
    </Box>
  )
}
