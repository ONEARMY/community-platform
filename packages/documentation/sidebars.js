/* global module */
module.exports = {
  mainSidebar: [
    {
      type: 'doc',
      label: 'Getting Started',
      id: 'Getting Started'
    },
    {
      type: 'category',
      label: 'How To Contribute',
      items: [
        'Contributing/guidelines',
        'Contributing/code-of-conduct',
        'Contributing/troubleshooting',
        //'Contributing/start-contributing',
        //'Contributing/bounties',
        /*{
          type: 'category',
          label: 'Writing Documentation',
          items: [
            'Contributing/Docs Contribution/running-docs-locally',
            'Contributing/Docs Contribution/md-style-guide',
          ],
        },*/
      ],
    },
    {
      type: 'category',
      label: 'Design',
      items: [
        'Design/our-design-system',
        'Design/contributing-feedback',
        'Design/contributing-designs',
      ],
    },
    {
      type: 'category',
      label: 'Frontend Development',
      items: ['Frontend Development/overview', 'Frontend Development/modules'],
    },
    {
      type: 'category',
      label: 'Backend Development',
      items: [
        'Backend Development/BackendOverview',
        'Backend Development/firebase-emulator',
        'Backend Development/firestore-backup',
        'Backend Development/integrations',
        'Backend Development/tests',
      ],
    },
    {
      type: 'category',
      label: 'Testing',
      items: ['Testing/overview', 'Testing/end-to-end'],
    },
    {
      type: 'category',
      label: 'Advanced Guides',
      items: [
        {
          type: 'category',
          label: 'Continuous Integration',
          items: ['Deployment/circle-ci'],
        },
        {
          type: 'category',
          label: 'Server Maintenance',
          items: [
            'Server Maintenance/dataMigration',
            'Server Maintenance/manualBackups',
          ],
        },
        {
          type: 'doc',
          label: 'Environmental Impact',
          id: 'Environmental Impact/environmental-impact',
        },
      ],
    },
    {
      type: 'doc',
      label: 'Security',
      id: 'Security',
    },
    {
      type: 'category',
      label: 'Maintainers',
      items: [
        {
          type: 'doc',
          label: 'Overview',
          id: 'Maintainers/overview',
        },
        {
          type: 'doc',
          label: 'Onboarding',
          id: 'Maintainers/onboarding',
        },
      ],
    },
    {
      type: 'link',
      label: 'Component Storybook',
      href: 'pathname:///storybook-static/index.html',
    },
  ],
}
