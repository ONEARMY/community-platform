---
id: mdx
title: Using React in docs
---

We don't really do this, but if wanted you can!

You can write JSX and use React components within your Markdown thanks to [MDX](https://mdxjs.com/).

export const Highlight = ({children, color}) => ( <span style={{
      backgroundColor: color,
      borderRadius: '2px',
      color: '#fff',
      padding: '0.2rem',
    }}>{children}</span> );

<Highlight color="#25c2a0">Docusaurus green</Highlight> is my favorite colors.

I can write **Markdown** alongside my _JSX_!
