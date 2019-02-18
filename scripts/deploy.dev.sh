printenv
# set project (default = dev)
firebase use default
# assign variables that can be accessed from firebase config method for backend functions
firebase functions:config:set \
firebase.project_id="precious-plastics-v4-dev" \
firebase.private_key_id=$firebase_dev_private_key_id \
firebase.private_key=$firebase_dev_private_key \
firebase.client_email=$firebase_dev_client_email \
firebase.client_id=$firebase_dev_client_id
# deploy site, functions, rules etc.
firebase deploy