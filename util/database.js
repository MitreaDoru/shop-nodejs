

/// For sequyelize
// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-js', 'root', 'Mitrea11', { dialect: 'mysql', host: 'localhost' });

// module.exports = sequelize;




///For SQL
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-js',
//     password: 'Mitrea11'
// });

// module.exports = pool.promise();

/// For mongoDb
// const mongodb = require('mongodb');
// let _db;
// const MongoClient = mongodb.MongoClient;
// const mongoConnect = (callback) => {
//     MongoClient.connect('mongodb+srv://mitreadru:Genius11@cluster0.fqxrlrh.mongodb.net/shop?retryWrites=true&w=majority')
//         .then(client => {
//             console.log("Connected!")
//             _db = client.db()
//             callback()
//         })
//         .catch(err => {
//             console.log(err)
//             throw err
//         })

// }

// const getDb = () => {
//     if (_db) {
//         return _db
//     }
//     throw 'No db found'
// }
// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;

