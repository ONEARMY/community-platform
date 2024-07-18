SERVICE_NAME="oa-api"
PROJECT_ID="${GOOGLE_PROJECT_ID:-onearmy-test-ci}"

# Build Docker image for the "experiment-0424" application
# Specifying the "--platform linux/amd64" flag ensures that the image is built for the Linux/AMD64 platform
docker build --platform linux/amd64 . -t gcr.io/$PROJECT_ID/$SERVICE_NAME

# Push the built Docker image to the Google Container Registry (GCR)
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME 

# Deploy the Docker image to Google Cloud Run
# "--image" specifies the image to be deployed
# "--project onearmyworld" is the Google Cloud project where the service will be deployed
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --project $PROJECT_ID \
  --allow-unauthenticated

gcloud beta run services update $SERVICE_NAME --service-min-instances 1