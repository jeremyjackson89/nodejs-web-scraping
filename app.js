var express = require('express');
var request = require('request-promise');
var cheerio = require('cheerio');
var app = express();

app.get('/webscrape', function(req, res) {
    var url = 'https://en.wikipedia.org/wiki/Final_Fantasy_VII';
    request({
        uri: url,
        transform: function(body) {
            return cheerio.load(body);
        }
    }).then(function($) {
        var scrapedData = {};
        
        scrapedData.title = $("#firstHeading").text().trim();
        scrapedData.openingParagraphs = [];

        var currentParagraph = $("p").first();
        scrapedData.openingParagraphs.push(currentParagraph.text().trim());

        while(currentParagraph.next().text().length > 0) {
        	currentParagraph = currentParagraph.next();
        	scrapedData.openingParagraphs.push(currentParagraph.text().trim());
        }
        
        res.send(scrapedData);

    }).catch(function(error) {
        console.log("Oh no! There was an error getting the page!");
        console.log("It looks like the error was", error);
        res.send({
            error: error
        });
    });
});

app.listen('1337', function() {
    console.log('App is listening on port 1337');
});