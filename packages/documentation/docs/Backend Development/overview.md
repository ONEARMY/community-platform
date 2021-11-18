---
id: BackendOverview
title: Overview
---

We're currently using cloud functions as part of the existing firebase ecosystem to handle server-side functions. These exist in the functions folder of the repo and have examples of how to trigger from api, cron or direct call.

We have discussed the likes of serverless and aws lambda and are open to using other platforms for microservices, however we are unlikely to do so until we have more stability within the core platform (unless an immediate blockage becomes apparent within the existing tech stack). When designing for backend, devs should try to keep a microservices architecture in mind and write code that could function in multiple environments (i.e. separate out core and platform logic, keep well documented etc.)

So far all of the functions have been written in a node environment, we are not opposed to other languages (and many in the community have experience of python, php etc.) however additional considerations will need to be given for the best way to support the required servers.
