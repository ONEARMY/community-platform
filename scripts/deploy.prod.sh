# set project
firebase use production
# assign variables that can be accessed from firebase config method for backend functions
firebase functions:config:set \
firebase.project_id="onearmyworld" \
firebase.private_key_id=$firebase_prod_private_key_id \
firebase.private_key=$firebase_prod_private_key \
firebase.client_email=$firebase_prod_client_email \
firebase.client_id=$firebase_prod_client_id
# deploy site, functions, rules etc.
firebase deploy