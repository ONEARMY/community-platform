import { Box, Flex } from 'rebass/styled-components'
import styled from 'styled-components'

export async function getServerSideProps(context) {
  return {
    props: {
      slug: context.params.slug,
    },
  }
}

const MoreBox = styled(Box)`
  position: relative;
  &:after {
    content: '';
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    top: 55%;
    transform: translate(-50%, -50%);
    left: 50%;
    max-width: 850px;
    background-position: center 10%;
  }
`

export default function HowtoArticle({ slug }) {
  return (
    <div id="HowtoArticle">
      <pre>{JSON.stringify(slug)}</pre>
      <h1>Slug: {slug}</h1>
      <p>Individual How to article</p>

      <footer>Published {Date.now()}</footer>

      <MoreBox py={20} mt={20}>
        <div>
          You're done.
          <br />
          Nice one!
        </div>
        <Flex justifyContent={'center'} mt={2}>
          Back
        </Flex>
      </MoreBox>
    </div>
  )
}
