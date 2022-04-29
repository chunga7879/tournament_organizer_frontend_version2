#! /bin/bash

npm run build

rclone *
# Used to cleanup unfinished uploads
#rclone --config rclone.config cleanup S3:hairless.brycemw.ca
