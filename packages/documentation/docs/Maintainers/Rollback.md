---
id: rollback
title: Rollback a Release
---

As a maintainer, you may need to rollback a release if a deployment has gone wrong or if there are issues with the site. This document outlines the steps to rollback a release.

Note: Do not use the Firebase UI to do this for hosting, as it will not rollback our serverless functions.

Use the CircleCI to perform the rollback deployment so that we go through the same steps as a normal deployment.

1. Access CircleCI Build Pipelines:

   - Navigate to the CircleCI build pipelines interface.

2. Locate the Desired Release:

   - Use the search function to find the specific release you want to rollback to.
   - Click on the corresponding build number to view its details.

3. Access Workflow View:

   - Once on the build details page, switch to the workflow view.

4. Initiate Rerun:

   - Identify the workflow corresponding to the release you wish to rollback to.
   - Click on the "Rerun" button associated with this workflow.
   - From the options presented, select "Rerun workflow from start".

5. Optional: Selective Deployment:
   - If you don't intend to deploy to all production environments, you have the option to cancel specific jobs after they've started.

By following these steps, you can effectively rollback a release in your deployment pipeline using CircleCI.
