rm -rf web-build
expo build:web
cd web-build
aws s3 sync . s3://spectre.zsi --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
cd ..