var Promise = require("bluebird")
var rp = require('request-promise');
var request = require('request')
var fs = require('fs-extra-promise')
var path = require('path')
var multer = require('multer')

var pipeResponse = require("./pipeResponse")

var express = require('express')
app = express()
//app.use(bodyParser.json())

//app.use(multer({dest: "./tmp"}));
var self = this

app.get("/sendMedia", function (req, res) {

    console.log("studioAPI", req.headers)
    var options = {
        uri: 'http://localhost:4000/sendMedia2',
        formData: {
            attachments: [
                fs.createReadStream(__dirname + '/pdf.pdf'),
            ]
        },
        method: 'POST'
    };
    var reqTextLayer = request('http://localhost:4000/sendMedia2', options, function() {
        console.log("request finished");
    })

    pipeResponse(reqTextLayer, function(message) {
        console.log("after " + message)
        res.end(message)
    })

    //pipeResponse(reqTextLayer, function(message) {
    //    res.send(message)
    //});
    //reqTextLayer.then(function (data) {
    //    //  console.log(data)
    //    //lastSend(reqStudio)
    //
    //})
    //    .catch(function (err) {
    //        console.log(err)
    //    })
    //

})

function lastSend(bufferdata) {

    var options = {
        uri: 'http://localhost:4000/writeMediaWithMulter',
        //uri: 'http://localhost:4000/writeMediaWithoutMulter',
        formData: {
            myFile: [bufferdata],
            index:1

        },
        method: 'POST'
    };
    rp(options)

}

/*
 Text Layer
 */
app.post("/sendMedia2", multer({
    dest: "./tmp",
    rename: function (a, b) {
        return a
    }
    /*, onParseStart: function () {
        console.log('Form parsing started at: ', new Date())
    }
    , onParseEnd: function (req, next) {
        console.log('Form parsing completed at: ', new Date());

        // usage example: custom body parse


        // call the next middleware
        next();
    }*/
}), function (req, res) {
    console.log("studioAPI", req.headers)

    var temppath = path.resolve('./tmp/' + req.files.attachments.name)

    //var file = fs.readFileSync(temppath, 'binary');
    //res.setHeader('Content-Length', file.length);
    //res.write(file, 'binary');
    //res.download(temppath);
    res.sendFile(temppath);


})


app.post("/writeMediaWithMulter",
    multer({
        dest: "./tmpWrite"
    }), function (req, res) {
        console.log("studioAPI", req.headers)

    })

app.post("/writeMediaWithoutMulter",multer(),
    function (req, res) {
        var pathFileToSave = "./tmp/result.pdf";
        console.log("studioAPI", req.headers)
        var streamTiles = fs.createWriteStream(pathFileToSave);
        req.on('end', function () {
            console.log('req end');
        });
        streamTiles.on('finish', function () {
            console.log('file has been written');
        });
        console.log(req.body.file.length)
        streamTiles.write(req.body.file);
        streamTiles.end(function () {
            console.log('done');
        });

    })
app.listen(4000);


