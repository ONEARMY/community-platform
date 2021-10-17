import { Flex, Link, Text } from 'rebass/styled-components'

const SiteFooter = () => {
  return (
    <Flex
      bg="#27272c"
      justifyContent="center"
      alignItems="center"
      style={{ padding: '25px 0 20px' }}
    >
      <Link
        href="https://www.onearmy.earth/"
        target="_blank"
        className="oa-link w-inline-block"
        rel="noreferrer"
        color="#fff8ef"
        fontSize="15px"
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          style={{ fontSize: 'Klima, sans-serif' }}
        >
          <svg
            width="25"
            height="25"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 63"
          >
            <g fill="none">
              <path
                d="M14.1 30.07c-1.53-.79-8.6-3.76-14.1-7.78 1.81-3.38 3.1-5.56 5-9.11 2.72 1.15 1.9.55 4.56 1.71.85.37 10.06 4.52 13.82 6.2 2.35 1.06 4.66 2.2 7 3.33L43 30.53l8.06 3.92c4 2 7.24 3.53 11.26 5.47.54.26-3.67 9.39-3.67 9.39-1.68-.56-3.92-1.77-5.53-2.48-4.67-2.06-9-3.92-13.7-6-4-1.76-6.71-2.91-10.77-4.51-3.65-1.43-11.51-4.67-14.55-6.25Z"
                fill="#20B7EB"
              />
              <path
                d="M12.15 54.91a17.51 17.51 0 0 1-2.47 1.63 18.82 18.82 0 0 1-1.26-1.48c-.29-1.16-2.26-4.94-2.68-6.17-.13-.41-.7-2.21-.81-2.63 0 0 5-3.36 8.18-5.94 3.18-2.58 6.17-5 9.3-7.46 1.36-1.07 3.89-2.5 5.3-3.48 2.48-1.72 13-9.07 15.56-10.55a175.93 175.93 0 0 1 16.82-9c1.69 3.49 1.83 3 3.81 6.9 0 0-17.78 13.49-22.65 17.14-3.773 2.84-7.55 5.67-11.33 8.49-1.71 1.26-3.46 2.44-5.19 3.66"
                fill="#E9475A"
              />
              <path
                d="m20.75 2.88-.2-.81C25 0 31.21-.26 31.37.19c.4 1.12.9 2.22 1.25 3.36 1.36 4.36 2.66 8.74 4 13.1.44 1.42 2.76 10 2.85 10.5.55 2.8 1.17 5.58 1.65 8.39.79 4.67 1.41 8.61 2.33 13.27.62 3.14 1.32 6.31 2.3 11.28 0 0-5.79 1.36-7.47 1.81-.75.2-1.51.37-2.4.59-.26-1.07-.23-1.17-.45-2.11-.87-3.66-1.76-7.32-2.61-11-1.49-6.42-3-12.85-4.43-19.28A150.58 150.58 0 0 0 24 14.22c-1-3.12-1.77-6.34-2.66-9.52-.26-.9-.34-.92-.59-1.82Z"
                fill="#FECE4E"
              />
            </g>
          </svg>
          <Text ml="10px">
            Precious Plastic is a project by{' '}
            <Text
              display="inline-block"
              style={{ textDecoration: 'underline' }}
            >
              One Army
            </Text>
          </Text>
        </Flex>
      </Link>
    </Flex>
  )
}

export default SiteFooter
