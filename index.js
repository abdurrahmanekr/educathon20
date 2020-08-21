const path = require('path');
const express = require('express');
const app = express();

// headers set
app.disable('x-powered-by');

// parser set
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/', pages.homepage);
app.get('/course/:id', pages.courseSingle);

app.post('/register', pages.register);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log('Application running on http://localhost:' + PORT + '/');
});
