"use strict";
/**
 * mysql连接工具
 */
const mysql = require("mysql");
const BaseClass = require("../base/base_class");
class MysqlUtil extends BaseClass {
    constructor() {
        super();
        this.instances = {};
    }
    /**
     * @function getPool
     * @param {
     *      host:string
     *      user:string
     *      port:number     
     *      password:string
     *      database:string
     * } instance 
     * @return {poolInstance}
     */
    getPool(instance) {
        try {
            let poolName = `${instance.host}_${instance.database}`;
            if (!this.instances[poolName]) {
                this.instances[poolName] = mysql.createPool({
                    host: instance.host,
                    user: instance.user,
                    password: instance.password,
                    port: instance.port,
                    database: instance.database
                });
            }
            return this.instances[poolName];
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    query(sql, arr, instance) {
        return new Promise((resolve, reject) => {
            (this.getPool(instance)).query(sql, arr, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }
}

module.exports = new MysqlUtil();