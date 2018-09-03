var mongoose = require('mongoose');

mongoose.connect('mongodb://meir:meir6741@ds111336.mlab.com:11336/chavrussa?3t.connectTimeout=10000&3t.uriVersion=2&3t.databases=chavrussa&3t.connectionMode=direct&3t.connection.name=chavrussa&readPreference=primary&3t.socketTimeout=0');

const Schema = mongoose.Schema;


export module modules {

    export const Questions = mongoose.model('Questions', {

        url: String,
        userName: String,
        date: Date,
        question: String,
        text: String,
        location: String,
        type: String,
        answers: [{ type: Schema.Types.ObjectId, ref: 'Answers' }]

    });

    export const Answers = mongoose.model('Answers', {

        userName: String,
        text: String,
        date: Date,
        questionId: String

    });

}