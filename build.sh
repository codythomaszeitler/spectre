rm -rf web-build
expo build:web
cd web-build
aws s3 sync . s3://sceptresystem.org --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
aws s3 sync . s3://sceptersystem.org --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
cd ..
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome sceptresystem.org