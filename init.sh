cd ./wanda
yarn build
cd ../vision
yarn build
cd ../strange
yarn build
pm2 restart npm
