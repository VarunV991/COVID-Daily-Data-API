var express = require('express');
var app = express();
var cheerio = require('cheerio');
var request = require('request');
var cors = require('cors')
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", '*');
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
//     next();
// });
app.use(cors());
app.get('/',function(req,res){
    res.redirect('/canada');
})

app.get('/canada',function(req,res){
    var url = 'https://en.wikipedia.org/wiki/COVID-19_pandemic_in_Canada';
    var coviddata = {}
    request(url, function(err, resp, body) {
        if (err)
            throw err;
        $ = cheerio.load(body);
        data = [];
        var canadaCases = 0;
        var canadaRecovered = 0;
        var canadaDeaths = 0;
        for(var i = 3;i<16;i++){
            $("#mw-content-text > div.mw-parser-output > table:nth-child(14) > tbody > tr:nth-child("+i+")").each((index,element) =>{
                var cdata = $(element).find("td");
                var statename = $(cdata[0]).text();
                var cases = parseInt($(cdata[4]).text().replace(',',''));
                var recovered = parseInt($(cdata[6]).text().replace(',',''));
                var deaths = parseInt($(cdata[7]).text().replace(',',''));
                var statedata = {state:statename,cases:cases,recovered:recovered,deaths:deaths}
                // Adding the cases of the state to overall country data
                canadaCases+=cases;
                canadaRecovered +=recovered;
                canadaDeaths += deaths;
                data.push(statedata);
            });
        }
        // Adding the cases of Repatriated travellers
        var canada = {state:"canada",cases:canadaCases+13,recovered:canadaRecovered+13,deaths:canadaDeaths}
        data.push(canada);

        coviddata = {"canada":data}
        res.send(coviddata);
    });
})


app.listen(process.env.PORT || 3001);