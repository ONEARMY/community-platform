# App Engine Cron with Google Cloud Functions for Firebase

Google App Engine provides a Cron service. Using this service for scheduling and
Google Cloud Pub/Sub for distributed messaging, you can build an application to
reliably schedule tasks which can trigger Google Cloud Functions.

This sample contains two components:

- An App Engine application, that uses App Engine Cron Service
  to relay cron messages to Cloud Pub/Sub topics.

- A sample Cloud Function which triggers hourly.

## Configuration

By default this sample triggers hourly, daily, and weekly. If you want to
customize this schedule for your app then you can modify the [cron.yaml](/appengine/cron.yaml).

For details on configuring this, please see the [cron.yaml Reference](https://cloud.google.com/appengine/docs/standard/python/config/cronref)
in the App Engine documentation.

## Deploying

The overview for configuring and running this sample is as follows:

### 1. Prerequisites

- If you don’t already have one, create a
  [Google Account](https://accounts.google.com/SignUp).

- Create a Developers Console project.
  1. Install (or check that you have previously installed)
     - [`git`](https://git-scm.com/downloads)
     - [`node` and `npm`](https://nodejs.org/en/)
     - [Google Cloud SDK](http://cloud.google.com/sdk/)
  2. [Enable the Pub/Sub API](https://console.cloud.google.com/flows/enableapi?apiid=pubsub&redirect=https://console.cloud.google.com)
  3. [Enable Project Billing](https://support.google.com/cloud/answer/6293499#enable-billing)

### 2. Clone this repository

To clone the GitHub repository to your computer, run the following command:

    $ git clone https://github.com/firebase/functions-cron

Change directories to the `functions-cron` directory. The exact path
depends on where you placed the directory when you cloned the sample files from
GitHub.

    $ cd functions-cron

Leave the default cron.yaml as is for now to run through the sample.

### 3. Deploy to App Engine

1. Configure the `gcloud` command-line tool to use the project your Firebase project.

```
$ gcloud config set project <your-project-id>
```

2. ** NOT REQUIRED ** Change directory to `appengine/`

```
$ cd appengine/
```

3. Install the Node dependencies

```
$ npm install
```

4. ** NOT REQUIRED ** Create an App Engine App

```
$ gcloud app create
```

5. Deploy the application to App Engine.

```
# You can also run 'npm run deploy'
$ gcloud app deploy app.yaml cron.yaml
```

6. Open `https://YOUR_PROJECT_ID.appspot.com` to make sure your AppEngine app
   was correctly deployed. You should see a "Hello, world!" message.

### 3. Deploy to Google Cloud Functions for Firebase

See `./functions.README`

### 4. Verify your Cron Jobs

We can verify that our function is wired up correctly by opening the [Cron jobs](https://console.cloud.google.com/appengine/cronjobs) tab in AppEngine.

The sample functions we deployed only has one function: `hourly_job`. To trigger
this function, manually send a PubSub message from the command line:

```shell
$ gcloud pubsub topics publish hourly-tick --message="Hello!"
```

Then, go to your terminal and run...

```shell
$ firebase functions:log --project <FIREBASE_PROJECT_ID>
```

You should see some logs like this:

```
2018-10-03T22:01:16.127718376Z D hourly_job: Function execution started
2018-10-03T22:01:16.310Z I hourly_job: This job is run every hour!
2018-10-03T22:01:16.390Z I hourly_job: Message Data: Hello!
```

### 5. You're Done!

Your cron jobs will now "tick" along forever. As I mentioned above, you're not
limited to the `hourly-tick`, `daily-tick` and `weekly-tick` that are included
in the AppEngine app. You can add more scheduled functions by modifying the [cron.yaml](/appengine/cron.yaml) file and re-deploying.

## License

Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
