import * as express from "express";
import { json, urlencoded, bodyParser } from "body-parser";

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

app.use((req, res, next)  => {
    res.header("Access-Control-Allow-Methods", " GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Origin", "*");

    if ('OPTIONS' == req.method) {
        res.sendStatus(200)
    }
    else {
        next();
    }
});

/** logging */

// ****** API Routes ***** //


app.get("/", (req, res) => {
    res.send('chavrussa API HealthCheck');
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