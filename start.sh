#!/bin/sh
cd /app
npx sequelize db:migrate
npx ts-node src/scripts/importMasterData.ts
node dist/server.js
