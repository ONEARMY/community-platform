# set project
firebase use production
# assign variables that can be accessed from firebase config method for backend functions
# NOTE - GA_SERVICE_PROD is json encrypted as base64 string (using https://www.browserling.com/tools/json-to-base64)
firebase functions:config:set service.json="$SERVICE_ACCOUNT_JSON_PROD"
firebase functions:config:set analytics.json="$REACT_APP_ANALYTICS_JSON_PROD"
# deploy site, functions, rules etc.
#echo $(firebase functions:config:get)
firebase deploy