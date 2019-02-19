# set project (default = dev)
firebase use default
# assign variables that can be accessed from firebase config method for backend functions
# NOTE - client_email has been encoded as base64 on the server to avoid difficulty with
# special characters
firebase functions:config:set service.project_id="precious-plastics-v4-dev"
firebase functions:config:set service.private_key_id="$firebase_dev_private_key_id" \
service.private_key="$firebase_dev_private_key" \
service.client_email="$firebase_dev_client_email" \
service.client_id="$firebase_dev_client_id"
# deploy site, functions, rules etc.
#echo $(firebase functions:config:get)
firebase deploy