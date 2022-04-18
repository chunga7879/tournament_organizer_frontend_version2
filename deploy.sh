#! /bin/bash

npm run build

rclone --config rclone.config --update --use-server-modtime --fast-list --progress sync build S3:hairless.brycemw.ca
# Used to cleanup unfinished uploads
#rclone --config rclone.config cleanup S3:hairless.brycemw.ca
