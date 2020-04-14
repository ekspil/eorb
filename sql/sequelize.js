const Sequelize = require('sequelize');
const sequelize = new Sequelize("", "sa", "Cfvjktn1", {
    host: conf.sqlServ,
    port: conf.sqlPort,
    dialect: 'mssql',
    logging: false
});


sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize