module.exports = {
  mainSidebar: {
    'Getting Started': [
      'Getting Started/setup',
      'Getting Started/recommended-tools',
    ],
    'How To Contribute': [
      'Contributing/bounties',
      'Contributing/maintainer',
      {
        'Writing Documentation': [
          'Docs Contribution/running-docs-locally',
          'Docs Contribution/md-style-guide',
        ],
      },
    ],
    'Frontend Development': ['Frontend Development/overview'],
    'Backend Development': ['Backend Development/firebase-emulators'],
    Testing: ['Testing/overview', 'Testing/end-to-end'],
    'Advanced Guides': [
      { 'Continuous Integration': ['Deployment/circle-ci'] },
      {
        'Server Maintenance': [
          'Server Maintenance/dataMigration',
          'Server Maintenance/manualBackups',
        ],
      },
    ],
  },
}
