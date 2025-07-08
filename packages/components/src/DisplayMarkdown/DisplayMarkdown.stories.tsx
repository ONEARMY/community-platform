import { DisplayMarkdown } from './DisplayMarkdown'

import type { Meta, StoryFn } from '@storybook/react-vite'

export default {
  title: 'Components/DisplayMarkdown',
  component: DisplayMarkdown,
} as Meta<typeof DisplayMarkdown>

const markdown: any = `# h1 Heading 8-)

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading

## Horizontal Rules

***

***

***

## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'

## Emphasis

**This is bold text**

**This is bold text**

*This is italic text*

*This is italic text*

~~Strikethrough~~

## Blockquotes

> Blockquotes can also be nested...> ...by using additional greater-than signs right next to each other...> ...or with spaces between arrows.

## Lists

Unordered

* Create a list by starting a line with '+', '-', or '*'
* Sub-lists are made by indenting 2 spaces:
  * Marker character change forces new list start:
    * Nulla volutpat aliquam velit
    - Facilisis in pretium nisl aliquet
    * Ac tristique libero volutpat at
* Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa
4. You can use sequential numbers...

Start numbering with offset:

1. foo
2. bar

| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link [https://github.com/nodeca/pica](https://github.com/nodeca/pica) (enable linkify to see)
`

export const Default: StoryFn<typeof DisplayMarkdown> = () => (
  <DisplayMarkdown body={markdown} />
)
