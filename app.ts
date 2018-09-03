import * as express from "express";
import { json, urlencoded, bodyParser } from "body-parser";
import { modules } from './dbSchemas/modules';
const url = require('url');
var RateLimit = require('express-rate-limit');
const Promise = require('bluebird');


var http = require('http');


// Routes & Internals Imports



// **** Configuration **** //
var port = process.env.PORT || 3004;

//  **** Express default Configuration **** //
const app: express.Application = express();

// app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc) 

var limiter = new RateLimit({
    windowMs: 0, // 15 minutes 
    max: 1000000000000000000000000, // limit each IP to 100 requests per windowMs 
    delayMs: 10000000000000 // disable delaying - full speed until the max limit is reached 
});

//  apply to all requests 
app.use(limiter);


app.disable("x-powered-by");
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: true }));
//app.use(apm.middleware.express())

var httpServer = http.createServer(app);

httpServer.listen(port);

//const io = socketIo(httpServer);

/** logging */

// ****** API Routes ***** //

app.post("/question", (req, res, next) => {


    let myURL = url.parse(req.body.question.url);
    let location = myURL.pathname.substring(1, myURL.pathname.length - 1).replace(/\.|_/ig, ' ');

    req.body.question.location = location;
    let question = new modules.Questions(req.body.question);
    question.save()
        .then(doc => {
            res.json({ id: question._id })
        })
        .catch(err => {
            next(err)
        })
});


app.get("/questions", (req, res, next) => {

    modules.Questions.find({}).sort({ _id: -1 }).limit(10).populate('answers').lean()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            next(err)
        })
});

app.post("/answer", (req, res, next) => {

    let answer = new modules.Answers(req.body.answer);

    answer.save()
        .then(doc => {
            modules.Questions.update({ _id: req.body.answer.questionId }, { $addToSet: { answers: doc._id } })
                .then(push => {
                    console.log(push);
                })
                .catch(err => {
                    next(err)
                });
            res.json(doc);
        })
        .catch(err => {
            next(err)
        })
});

app.get("/answer", (req, res, next) => {

    let questionId = req.query.questionId;
    let data = { };

    Promise.all([
        modules.Answers.find({ questionId: questionId }).lean()
            .then(doc => data['answers'] = doc),

        modules.Questions.find({ _id: questionId }).lean()
            .then(doc => {
                data['question'] = doc
            })
    ]).then(() => {
        res.json(data);
    })
});

// ***** Error Handling *** /
// catch 404 and forward to error handler
app.use(function (req: express.Request, res: express.Response, next) {
    let err = new Error("Not Found");
    next(err);
});

// handle 500
app.use((err: express.Error, req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (!err.statusCode)
        res.status(err.status || 500);

    res.json({ message: err.message });
});

// ***** Server Execution **** //
console.log('Magic happens on port ' + port);