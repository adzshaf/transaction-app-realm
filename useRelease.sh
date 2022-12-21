#!/bin/bash
yarn build-release
cd android
./gradlew clean
sudo rm -rf ./app/src/main/res/drawable-*

./gradlew installRelease