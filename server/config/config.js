var path = require('path');
var rootPath = path.normalize(__dirname+'/../../');

module.exports = {
    development:{
        db: 'mongodb://localhost/mean',
        rootPath: rootPath,
        port: process.env.PORT || 3030
    },
    production:{
        rootPath:rootPath,
        db:'mongodb://test:test@ds149138.mlab.com:49138/mean',
        port:process.env.PORT || 80
    }
}