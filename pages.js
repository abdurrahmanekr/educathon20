const SQLMaster = require('sqlmaster');
const path = require('path');
const ejs = require('ejs');
const read = require('fs').readFileSync;

const Database = require('./database');

const {
    passwordHash,
} = require('./common');

const courses = [{
    id: '1',
    name: 'JS Programa Dili',
    price: '10₺',
    description: 'JavaScript Öğrenin',
    student: '2,193',
    comment: '0',
    info: '4 Ders / 12 hafta',
    teacher: {
        id: '3',
        name: 'Abdurrahman Eker',
        description: 'Yazılımcı',
    },
},{
    id: '2',
    name: 'Fizik Kurallları',
    price: '10₺',
    description: 'Fizik Kuralllarını Öğrenin',
    student: '2,193',
    comment: '0',
    info: '4 Ders / 12 hafta',
    teacher: {
        id: '2',
        name: 'Rıdvan Sağlam',
        description: 'Designer',
    },
},{
    id: '3',
    name: 'Logo Tasarlama',
    price: '10₺',
    description: 'Logo Tasarlama Öğrenin',
    student: '2,193',
    comment: '0',
    info: '4 Ders / 12 hafta',
    teacher: {
        id: '1',
        name: 'Alen Taşcıoğlu',
        description: 'Eğitimci',
    },
}];

module.exports = {
    homepage: (req, res) => {
        const page = path.join(__dirname, 'web', 'index.ejs');

        const error = req.query.error ? Buffer.from(req.query.message, 'base64').toString('utf8') : null;

        const sessionUser = req.session.user;

        const result = ejs.compile(read(page, 'utf8'), {
            filename: page,
        })({
            courses: courses,
            error: error,
            sessionUser: sessionUser,
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
            res.redirect('/?error=true&message=' + Buffer.from('şifreler uyuşmuyor').toString('base64'));
            return;
        }

        const query = SQLMaster
        .from('users')
        .insert({
            email: email,
            password: passwordHash(password),
        })
        .exec();

        Database.execute(query)
        .then(user => {
            res.redirect('/login/?register=true');
        })
        .catch(err => {
            var message = Buffer.from(String(err.message)).toString('base64');
            res.redirect('/?error=true&message=' + message);
        });
    },
    courseSingle: (req, res) => {
        const id = req.params.id;
        const page = path.join(__dirname, 'web', 'course.ejs');

        const result = ejs.compile(read(page, 'utf8'), {
            filename: page,
        })({
            courses: courses,
            course: courses.find(x => x.id === id),
        });

        res
        .set('Content-Type', 'text/html')
        .send(result);
    },
    login: (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        const query = SQLMaster
        .from('users')
        .where('email = :email AND password = :password', {
            ':email': email,
            ':password': passwordHash(password),
        })
        .select([
            '*'
        ])
        .exec();

        Database.execute(query)
        .then(data => {
            if (data.rows.length < 1)
                throw new Error('Email veya şifre hatalı!');


            req.session.user = data.rows[0];

            // TODO session oluşturmak gerekecek
            res.redirect('/');
        })
        .catch(err => {
            var message = Buffer.from(String(err.message)).toString('base64');
            res.redirect('/login/?error=true&message=' + message);
        })
    },
    loginPage: (req, res) => {
        const id = req.params.id;
        const page = path.join(__dirname, 'web', 'login.ejs');

        const error = req.query.error ? Buffer.from(req.query.message, 'base64').toString('utf8') : null;

        const result = ejs.compile(read(page, 'utf8'), {
            filename: page,
        })({
            error: error,
        });

        res
        .set('Content-Type', 'text/html')
        .send(result);
    },
    logout: (req, res) => {
        req.session.destroy();

        res.redirect('/?logout=true')
    },
};
