#!/bin/bash
yarn build-debug
cd android
./gradlew installDebug

# adb -s 8338cc8b install /home/adzshaf/Documents/FASILKOM/transaction-app/android/app/build/outputs/apk/debug/app-debug.apk
# adb -s emulator-5554 install /home/adzshaf/Documents/FASILKOM/transaction-app/android/app/build/outputs/apk/debug/app-debug.apk