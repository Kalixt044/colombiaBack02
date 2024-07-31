# ColombiaBack

## Description
This project is a backend application for managing and accessing data related to Colombia. It uses various libraries and frameworks to handle HTTP requests, interact with databases, and manage the application environment.

## Features
- Uses express for setting up the server and handling routing.
- Supports CORS with cors package.
- Environment variable management with dotenv.
- Database interactions using better-sqlite3, sqlite3, and mysql2.
- Automatic server restart during development with nodemon.

## Installation
To install the necessary dependencies, run:
sh
npm install
Usage
To start the server in development mode, use:
npm run dev
This command will start the server using nodemon, which will automatically restart the server whenever file changes are detected.

Scripts
test: This script is a placeholder and currently not implemented.
dev: Starts the server in development mode using nodemon.
Dependencies
axios: ^1.7.2
better-sqlite3: ^11.1.2
cors: ^2.8.5
dotenv: ^16.3.1
express: ^4.18.2
mysql2: ^3.6.3
sqlite3: ^5.1.7
Dev Dependencies
nodemon: ^3.1.4
Author
Aprendiz Digital I J Gallardo Navarro

License
This project is licensed under the ISC License.
