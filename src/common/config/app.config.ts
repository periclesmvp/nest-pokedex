export const EnvConfiguration = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGODB,
    port: process.env.MONGODB || 3000,
    defaultLimit: + process.env.DEFAULT_LIMIT || 650,

})