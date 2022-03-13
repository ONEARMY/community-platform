import { Button } from 'oa-components'

export async function getServerSideProps(context) {
  return {
    props: {
      slug: context.params.slug,
    },
  }
}

export default function HowtoArticle({ slug }) {
  return (
    <div id="HowtoArticle">
      <pre>{JSON.stringify(slug)}</pre>
      <h1>Slug: {slug}</h1>
      <p>Individual How to article, needs to be loaded from the database</p>

      <footer>Published {Date.now()}</footer>

      <Button>A Button</Button>

      <div>
        <div>
          You're done.
          <br />
          Nice one!
        </div>
        <div>
          <a href="/">Back</a>
        </div>
      </div>
    </div>
  )
}
