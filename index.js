const path = require('path');
const express = require('express');
const session = require('express-session');
const app = express();

// headers set
app.disable('x-powered-by');

// parser set
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'educathon20',
    resave: true,
    saveUninitialized: true,
}))

const Database = require('./database');

Database.connect()
.then(() => {
    return Database.init(err => {
        if (err !== null) {
            console.error(err);
            process.exit(1);
        }
    });
})
.catch(err => {
    console.log('Veritabanı sorunu');

    console.error(err);
    process.exit(1);
});

const pages = require('./pages');

app.use('/public', express.static(path.join(__dirname, 'web', 'public')));

app.use('/admin/public', express.static(path.join(__dirname, 'admin', 'public')));

app.get('/', pages.homepage);
app.get('/course/:id', pages.courseSingle);
app.get('/login', pages.loginPage);
app.get('/logout', pages.logout);
app.get('/admin', pages.admin);
app.get('/admin/users', pages.adminUsers);
app.get('/admin/analytics', pages.adminAnalytics);

app.post('/login', pages.login);
app.post('/register', pages.register);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log('Application running on http://localhost:' + PORT + '/');
});
