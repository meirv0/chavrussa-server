import * as express from "express";
import { json, urlencoded, bodyParser } from "body-parser";
import { modules } from './dbSchemas/modules';

var http = require('http');


// Routes & Internals Imports



// **** Configuration **** //
var port = process.env.PORT || 3004;

//  **** Express default Configuration **** //
const app: express.Application = express();


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

    modules.Questions.find({}).lean()
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
    console.log(questionId);
    modules.Answers.find({ questionId: questionId }).lean()
        .then(doc => {
            res.json({ answers: doc });
        })
        .catch(err => {
            next(err)
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