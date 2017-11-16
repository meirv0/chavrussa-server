var mongoose = require('mongoose');

mongoose.connect('mongodb://meir:meir6741@ds111336.mlab.com:11336/chavrussa?3t.connectTimeout=10000&3t.uriVersion=2&3t.databases=chavrussa&3t.connectionMode=direct&3t.connection.name=chavrussa&readPreference=primary&3t.socketTimeout=0');

const Schema = mongoose.Schema;


export module modules {

    export const Questions = mongoose.model('Questions', {

        location: String,
        userName: String,
        localDateTime: Date,
        header: String,
        text: String,
        type: String
    });

    export const Answers = mongoose.model('Answers', {
        
        location: String,
        userName: String,
        localDateTime: Date,
        header: String,
        text: String,
        type: String
    });

}