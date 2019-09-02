module.exports = function() {
    this.dbConnections = [];

    this.dbConnections["kof"] = {
        host: "kof.cmk4tzokwqsd.us-west-2.rds.amazonaws.com",
        port: "3306",
        user: "kofadmin",
        password: process.env.Password_rdsKof,
        database: "undefined"
    };
};