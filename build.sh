rm -rf web-build
expo build:web
cd web-build
aws s3 sync . s3://spectre.zsi --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
cd ..
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome http://spectre.zsi.s3-website-us-east-1.amazonaws.com/