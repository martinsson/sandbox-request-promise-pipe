/**
 * Created by m.poitevin on 15/07/2015.
 */
var pipeResponse = require("./pipeResponse")

var fs = require('fs-extra-promise')
var readable = fs.createReadStream(__dirname + '/pdf.pdf');

pipeResponse(readable, console.log)