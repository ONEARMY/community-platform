#!/bin/bash
# DB Bootstrap - call emulator function to clean seed data
echo "Cleaning seed data"
curl -vs http://localhost:4002/community-platform-emulated/us-central1/emulator/seed-clean
echo "Creating seed users"
curl -vs http://localhost:4002/community-platform-emulated/us-central1/emulator/seed-users-create
echo "Creating seed user content"
curl -vs http://localhost:4002/community-platform-emulated/us-central1/emulator/seed-content-generate
echo "Complete"