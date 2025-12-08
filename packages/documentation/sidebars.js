/* global module */
module.exports = {
  mainSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['Getting Started/setup', 'Getting Started/recommended-tools'],
    },
    {
      type: 'category',
      label: 'Contributing',
      items: ['Contributing/start-contributing', 'Contributing/team-principles'],
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
      label: 'Testing',
      items: ['Testing/overview', 'Testing/end-to-end'],
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
        {
          type: 'doc',
          label: 'Releasing',
          id: 'Deployment/circle-ci',
        },
      ],
    },
  ],
};
