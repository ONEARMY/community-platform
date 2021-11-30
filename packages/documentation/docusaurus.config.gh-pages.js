module.exports = {
  title: 'OneArmy Community Platform',
  tagline: 'Developer Documentation',
  url: 'https://onearmy.github.io/community-platform',
  baseUrl: '/community-platform/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ONEARMY', // Usually your GitHub org/user name.
  projectName: 'community-platform', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'OneArmy Community Platform',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/',
          activeBasePath: '/',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/ONEARMY/community-platform',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: '/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/up3nBbEbxY',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/ONEARMY/community-platform',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()}`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        // https://v2.docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs/
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          // Please change this to your repo.
          editUrl:
            'https://github.com/ONEARMY/community-platform/edit/master/documentation',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
