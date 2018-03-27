var mongoose = require('mongoose'),
    crypto = require('crypto');

module.exports = function (config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;
    db.on('error',console.error.bind(console,'conncetion error...'));
    db.once('open', function callback() {
        console.log('mean db opened')
    });

    var userSchema = mongoose.Schema({
        firstName: String,
        lastName: String,
        username: String,
        salt:String,
        hashed_pwd:String,
        roles: [String]
    });
    userSchema.methods = {
        authenticate: function (passwordToMatch) {
            return hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
        }
    };
    var User = mongoose.model('User', userSchema);

    User.find({}).exec(function (err, collection) {
        if(collection.length === 0){
            var salt, hash;
            salt = createSalt();
            hash = hashPwd(salt, 'Flint');
            User.create({firstName: 'Den', lastName: 'Vasylenko', username: 'Flint', salt:salt, hashed_pwd:hash, roles:['admin']});
            salt = createSalt();
            hash = hashPwd(salt, 'tst');
            User.create({firstName: 'Test', lastName: 'Testovich', username: 'tst', salt:salt, hashed_pwd:hash, roles:[]});
            salt = createSalt();
            hash = hashPwd(salt, 'def');
            User.create({firstName: 'default', lastName: 'def', username: 'def', salt:salt, hashed_pwd:hash});
        }

    })
};
function createSalt() {
    return crypto.randomBytes(128).toString('base64');
}
function hashPwd(salt, pwd) {
    var hmac = crypto.createHmac('sha1', salt);
    hmac.setEncoding('hex');
    hmac.write(pwd);
    hmac.end();
    return hmac.read();
}