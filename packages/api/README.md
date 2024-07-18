# Platform API

This project is a simple Node.js server built using the Express framework. The server is configured to respond with a 501 Not Implemented status code for any request made to it. This basic implementation serves as a starting point for a more complex application or as a template for handling unimplemented routes in a larger project.

## Getting started

After [cloning the repo](https://github.com/ONEARMY/community-platform), you can start the API server, which will make the application available in your browser at [http://localhost:8080](http://localhost:8080/).

```
cd ./packages/api
yarn install
yarn start
```

### Testing the Server

You can test the server by making a request to any endpoint using a tool like curl, Postman, or your web browser. For example:

```sh
curl -X GET http://localhost:8080
```

The response should be:

```json
{
  "message": "Not Implemented"
}
```

## Docker Support

This project includes a Dockerfile for easy containerization.

### Building the Docker Image

To build the Docker image, use the following command:

```sh
docker build -t my-node-app .
```

### Running the Docker Container

To run the Docker container, use the following command:

```sh
docker run -p 8080:8080 my-node-app
```

By default, the server will run on port 8080 inside the container. You can access the server at http://localhost:8080.
