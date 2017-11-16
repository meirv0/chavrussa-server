var mongoose = require('mongoose');

mongoose.connect('mongodb://meir:meir6741@ds111336.mlab.com:11336/chavrussa?3t.connectTimeout=10000&3t.uriVersion=2&3t.databases=chavrussa&3t.connectionMode=direct&3t.connection.name=chavrussa&readPreference=primary&3t.socketTimeout=0');

const Schema = mongoose.Schema;

var User = {
    name: String
};

var UserModel = mongoose.model('User', User);

// let user = new UserModel({
//     name: 'test'
// })


UserModel.findOne({ name: 'test' }).lean()
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.error(err);
    })