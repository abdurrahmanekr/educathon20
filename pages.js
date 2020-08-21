const SQLMaster = require('sqlmaster');
const path = require('path');
const ejs = require('ejs');
const read = require('fs').readFileSync;

const Database = require('./database');

module.exports = {
    homepage: (req, res) => {
        const page = path.join(__dirname, 'web', 'index.ejs');

        const result = ejs.compile(read(page, 'utf8'), {
            filename: page,
        })({

        });

        res
        .set('Content-Type', 'text/html')
        .send(result);
    },
    register: (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const repassword = req.body.repassword;

        if (password !== repassword) {
            res.redirect('/?password_incorrect=true');
            return;
        }

        const query = SQLMaster
        .from('users')
        .insert({
            email: email,
            password: password,
        })
        .exec();

        Database.execute(query)
        .then(user => {
            res.redirect('/?register=true');
        })
        .catch(err => {
            var message = Buffer.from(String(err.message)).toString('base64');
            res.redirect('/?error=true&message=' + message);
        });
    },
    courseSingle: (req, res) => {
        const id = req.params.id;
        const page = path.join(__dirname, 'web', 'course-single.ejs');

        const result = ejs.compile(read(page, 'utf8'), {
            filename: page,
        })({

        });

        res
        .set('Content-Type', 'text/html')
        .send(result);
    }
};
