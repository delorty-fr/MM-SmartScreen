SET mypath=%~dp0
cd %mypath:~0,-1%
npm run start:win
