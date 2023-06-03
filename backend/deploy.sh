#!/usr/bin/bash

# upload all files to aws over scp except node_modules, package-lock.json, deploy.sh, artifacts, cache and .git
for i in *
do
    if [ "$i" != "node_modules" ] && [ "$i" != "package-lock.json" ] && [ "$i" != "deploy.sh" ] && [ "$i" != "artifacts" ] && [ "$i" != "cache" ] && [ "$i" != ".git" ]
    then
        scp -r $i dev2:~/backend
    fi
done


