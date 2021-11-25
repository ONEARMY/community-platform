module.exports = {
  mainSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['Getting Started/setup', 'Getting Started/recommended-tools'],
    },
    {
      type: 'category',
      label: 'How To Contribute',
      items: [
        'Contributing/bounties',
        'Contributing/maintainer',
        {
          type: 'category',
          label: 'Writing Documentation',
          items: [
            'Docs Contribution/running-docs-locally',
            'Docs Contribution/md-style-guide',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Frontend Development',
      items: ['Frontend Development/overview'],
    },
    {
      type: 'category',
      label: 'Backend Development',
      items: [
        'Backend Development/BackendOverview',
        'Backend Development/firebase-emulators',
        'Backend Development/integrations',
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
  ],
}
