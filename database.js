const path = require('path');
const fs = require('fs');
const { Client } = require('pg');

class Database {
    constructor() {
        this.connection = null;
    }

    connect(cb) {
        var opts = {
            user: 'postgres',
            database: 'educathon20',
            password: 'password',
            host: '127.0.0.1',
            port: 5432,
        };

        if (process.env.DATABASE_URL) {
            opts = {
                connectionString: process.env.DATABASE_URL,
                ssl: true,
            };
        }

        this.connection = new Client(opts);

        return this.connection.connect(cb);
    }

    execute(...args) {
        if (this.connection) {
            return this.connection.query(...args);
        }

        throw 'Connection not found!';
    }

    init(config = {}) {
        return new Promise((resolve, reject) => {
            const createPath = path.join(__dirname, 'create.sql');
            const create = fs.readFileSync(createPath).toString();

            // ayarları getirir
            this.connection.query('SELECT * FROM users')
            .catch(err => {
                // veritabanı oluşturulmamış o yüzden oluştur
                return this.connection.query(
                    create
                );
            })
            .catch(reject);
        });
    }

}

module.exports = new Database();
