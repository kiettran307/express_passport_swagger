const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
// const errorHandler = require('errorhandler');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
// const isProduction = process.env.NODE_ENV === 'production';

//Initiate our app
const app = express();
const options = {
    swaggerOptions: {
        authAction :{ JWT: {name: "JWT", schema: {type: "apiKey", in: "header", name: "Authorization", description: ""}, value: "<JWT>"} }

        // plugins: [
        //      DisableTryItOutPlugin
        // ],
        // supportedSubmitMethods: ['get']
    }
};
//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
//Configure Mongoose
mongoose.connect('mongodb://localhost:27017/passport-tutorial');
// mongoose.set('debug', true);

//Models & routes
require('./models/Users');
require('./config/passport');
app.use(require('./routes'));
app.listen(8000, () => console.log('Server running on http://localhost:8000/'));