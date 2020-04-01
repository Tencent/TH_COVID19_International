module.exports = {
    // 获取环境配置
    // 获取环境变量, 可以根据情况自定义
    getEnvValue() {
        return process.env.NODE_ENV || 'local'
    },
}
