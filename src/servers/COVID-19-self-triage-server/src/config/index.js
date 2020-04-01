/**
 * 使用方法：
 * 1. const config = require('../config/'); config.db.host
 * 2. global.config.fileName.configName, 比如：global.config.db.host
 *
 * 注意事项：
 * 1. 配置放在不同文件夹下，文件名为key，里面的内容为value，格式为json
 * 2. 文件名及json命名统一为：lowerCamelCase，小写驼峰，方便使用者调用
 * 3. formal/local下的配置文件名保持一致
 *
 * formal，正式环境配置
 * local，本地环境配置
 */
const path = require('path')
const fs = require('fs')
const logger = require('../util/log_util')('IndexConfig')
const EnvUtil = require('../util/env_util')

let config = {}
global.config = config // Export to global variable

logger.info(`IndexConfig|process.env: ${JSON.stringify(process.env)}`)
logger.info(`IndexConfig|EnvUtil.getEnvValue(): ${EnvUtil.getEnvValue()}`)

// 加载本地文件夹下的配置
function loadFolderConfig(folder) {
    logger.info(`IndexConfig|loadFolderConfig|start to load config from folder: ${folder}`)
    let fileNameArray = fs.readdirSync(path.join(__dirname, folder))

    fileNameArray.forEach(fileName => {
        logger.info(`IndexConfig|loadFolderConfig|fileName: ${fileName}`)

        // 忽略README.md
        if (fileName === 'README.md') {
            return
        }
        if (fileName === '.DS_Store') {
            return
        }
        let fileData = fs.readFileSync(path.join(__dirname, folder, fileName), 'utf8')
        logger.info(`IndexConfig|loadFolderConfig|fileData: ${fileData}`)
        config[fileName] = JSON.parse(fileData)
        logger.info(`IndexConfig|loadFolderConfig|config: ${JSON.stringify(config)}`)
    })
}

// 2. 加载对应环境下的配置
loadFolderConfig(EnvUtil.getEnvValue())


logger.info(`IndexConfig|module.exports|config: ${JSON.stringify(config)}`)
exports = module.exports = config
