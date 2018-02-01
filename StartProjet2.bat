cd Cadriciel
start cmd.exe @cmd /k "code"
cd server
start cmd.exe @cmd /k "npm start"
cd ../client
ng serve --open
