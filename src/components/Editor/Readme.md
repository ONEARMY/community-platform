# Desired end-user features

| Feature           | Category | Mandatory | Description                                                                                                                                                                       |
| ----------------- | -------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Text - Formatting | Text     | Yes       | Editor should have basic wysiwyg controls such as bold, italic, ... as well a font-picker                                                                                         |
| Tables            | Layout   | Yes       | Editor should provide a table command (rows/columns) to enter research data and/or use tables as layout tool                                                                      |
| Images            | Media    | Yes       | Editor should enable to reference or embed(copy) common media types, as preview or attachment. Also, a user may resize or re-position images later on.                            |
| Links             | Media    | Yes       | The editor should have a content picker (enabled for posts, comments, media) to easily add a link.                                                                                |
| Mentions          | Social   | Yes       | The editor should have a user picker for the '@' symbol.                                                                                                                          |
| Tags              | Content  | Yes       | The editor should have a tag picker for the '#' symbol.                                                                                                                           |
| Source/HTML       | Content  | Yes       | The editor should allow source editing in HTML or markdown. This would enable editing beyond the editor features and also being able to use external editors such as stackedit.io |  |

(edited with https://www.tablesgenerator.com/markdown_tables)

### Usage

```ts
import { Editor, VARIANT } from 'src/components/Editor'

<Editor
  content={'<p>some stuff</p>'}
  variant={VARIANT.SMALL}
  onChange={content => {
    return content.indexOf('strong language') === -1
  }}
/>
```
