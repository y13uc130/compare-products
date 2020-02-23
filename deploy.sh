#!/bin/bash

yarn build
cp -r build/* git-deploy/
cd git-deploy/
git add .
git commit -m "$1"
git push origin master