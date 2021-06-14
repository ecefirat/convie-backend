# Convie

A web app for grocery shopping.

# Roadmap

- Implementing a grocery delivery service(like ubereats)
- Drivers/riders can sign up and get notifications when an order is placed
- Delivery is completed when drivers deliver the groceries

# Installation

- Git clone both repos: https://github.com/ecefirat/convie-frontend and https://github.com/ecefirat/convie-backend
- npm install
- Create New MySQL Database
  - Priviligies -> Add user acc.
  - Create new login information
  - Import the sql file in the backend folder
- Create .env file in the root of both frontend and backend
- Go to backend .env file and add the lines below
  - host=localhost
  - user=yourusername
  - password=yourpassword
  - database=yourdatabasename
  - port=8889
  - Change user, password, database with your own your details
- Go to frontend .env file and paste REACT_APP_URL=http://localhost:5000
- npm run dev for backend
- npm start for frontend

# Technologies used

- React ^17.0.1
- Materialize-css: ^1.0.0-rc.2
- Node: ^15.12.0
- Express: ^4.17.1
- MySQL: 5.7.32

  - react-router-dom: is used for routing.
  - react-hook-form: ise used for forms.
  - react-spinners: is used for page loading animations.
  - bcrypt: is used for hashing passwords.
  - body-parser: is used for parsing incoming request bodies.
  - cors: cross-origin resource sharing; allows restricted resources coming from a different domain to be shown in the current active domain.
  - dotenv: loads environment variables from a .env file to process.env
  - express-fileupload: express middleware for uplaoding files.
  - express-mysql-session: mysql session store for express.
  - express-rate-limit: rate limiting middleware. it is used to limit repeated requests.
  - express-session: session middleware for express.
  - express-validator: middleware for validation of the input fields.
  - mysql: nodejs driver for mysql.
  - nodemon: automatically restarts the node application when there is a file change.
  - path: nodejs path module.
  - supertest and jest: is used for testing.
  - winston: is used for logging.
