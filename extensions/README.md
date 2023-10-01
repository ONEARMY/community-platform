# Firebase Extensions Directory

Firebase Extensions are pre-packaged solutions that help you perform common tasks and integrate additional services into your Firebase project. Each extension in this directory is designed to address a specific use case or functionality, providing a seamless development experience.

## Handling configuration

We should not store sensitive information in the `*.config` files, instead
we can reference environmental variables, which will then be set in the `.env` file.

At the time of writing the firebase CLI does not support this, so we need to use [envsubst](https://www.gnu.org/software/gettext/manual/html_node/envsubst-Invocation.html) to populate the `.env` file.

The environmental variables required are:

- CP_SMTP_CONNECTION_URI: A connection URI for the SMTP server

The suggested convention is for each environment variable to be prefixed with `CP_`.

## Deploy extension

Populate a `.env` based on the `.config` for each extension. This can be done with the following command:

```bash
envsubst < extensions/firestore-send-email.config > extensions/firestore-send-email.env
```

Run the following command from the project root directory:

```bash
firebase deploy --only extensions [--project project_id]
```
