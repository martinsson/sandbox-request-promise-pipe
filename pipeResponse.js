/**
 * Created by m.poitevin on 15/07/2015.
 */
var fs = require('fs-extra-promise')
var rp = require('request-promise');

function pipeExperiment(readableStream, callback) {
    var textLayerPath = "./tmp/testStream"
    var textLayerOutputStream = fs.createWriteStream(textLayerPath);
    textLayerOutputStream.on("pipe", function() {
        callback("pipe!!")
    })
    textLayerOutputStream.on("finish", function() {
        callback("finish!!")
    })
    textLayerOutputStream.on("error", function() {
        callback("error!!")
    })
    readableStream.pipe(textLayerOutputStream)
    textLayerOutputStream.on('finish', function() {
        callback("finished writing outputStream")
    })
    readableStream.on('end', function () {
        var textLayerInputStream = fs.createReadStream(textLayerPath);

        var dataStudio = {
            uri: 'http://localhost:4000/writeMediaWithMulter',
            //uri: 'http://localhost:4000/writeMediaWithoutMulter',
            formData: {
                myFile: textLayerInputStream,
                index: 1

            },
            method: 'POST'
        };
        var reqStudio = rp(dataStudio).then(function () {
            callback("yess")
        })
        callback("mouai!!!")


    })

}
module.exports = pipeExperiment;