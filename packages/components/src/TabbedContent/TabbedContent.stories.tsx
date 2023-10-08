import type { Meta, StoryFn } from '@storybook/react'
import { Tabs, TabsList, Tab, TabPanel } from './TabbedContent'
import { faker } from '@faker-js/faker'

export default {
  title: 'Components/TabbedContent',
} as Meta

const uppercase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const Default: StoryFn = () => {
  return (
    <Tabs defaultValue={0}>
      <TabsList>
        <Tab
          sx={{
            backgroundColor: 'transparent',
          }}
        >
          {uppercase(faker.lorem.word())}
        </Tab>
        <Tab>{uppercase(faker.lorem.word())}</Tab>
        <Tab>{uppercase(faker.lorem.word())}</Tab>
        <Tab>{uppercase(faker.lorem.word())}</Tab>
        <Tab>{uppercase(faker.lorem.word())}</Tab>
      </TabsList>

      <TabPanel>
        <p>{faker.lorem.paragraphs(3)}</p>
      </TabPanel>
      <TabPanel>
        <p>{faker.lorem.paragraphs(3)}</p>
      </TabPanel>
      <TabPanel>
        <p>{faker.lorem.paragraphs(3)}</p>
      </TabPanel>
      <TabPanel>
        <p>{faker.lorem.paragraphs(3)}</p>
      </TabPanel>
      <TabPanel>
        <p>{faker.lorem.paragraphs(3)}</p>
      </TabPanel>
    </Tabs>
  )
}
