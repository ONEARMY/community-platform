module.exports = {
  mainSidebar: {
    'Getting Started': ['Getting Started/setup', 'Getting Started/recommended-tools'],
    'How To Contribute': [
      'Contributing/bounties',
      'Contributing/maintainer',
      {
        'Writing Documentation': [
          'Contributing/documentation/running-docs-locally',
          'Contributing/documentation/md-style-guide',
          'Contributing/documentation/mdx',
        ],
      },
    ],
    'Frontend Development': ['Frontend Development/overview'],
    'Backend Development': ['Backend Development/running-emulators', 'Backend Development/emulator-seed-data'],
    'Advanced Guides': [
      { 'Continuous Integration': ['Deployment/circle-ci'] },
      {
        'Server Maintenance': ['Server Maintenance/dataMigration', 'Server Maintenance/manualBackups'],
      },
    ],
  },
}
