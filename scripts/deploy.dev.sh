# set project (default = dev)
firebase use default
# firebase variables are set using command line on a project-wide basis. Can be viewed with code below
# echo "firebase conf: $(firebase functions:config:get)"
# deploy site, functions, rules etc.
firebase deploy