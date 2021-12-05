Setting cors on storage bucket:
https://cloud.google.com/storage/docs/configuring-cors

`gcloud init`

`gsutil ls`

`gsutil cors set src/config/cors.json gs://[project-name].appspot.com`

Also need to remember to configure code to make cross-origin requests (where required, e.g. if using service workers cross-origin)
https://developers.google.com/web/tools/workbox/guides/handle-third-party-requests
