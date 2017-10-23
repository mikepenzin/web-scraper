var express     = require('express'),
    bodyParser  = require("body-parser"),
    osmosis     = require('osmosis'),
    forEach     = require('async-foreach').forEach,
    app         = express();
    
    
// Configure public folder for static files
app.use(express.static(__dirname + "/public", { maxAge: 8640000000 }));

// Configure view engine
app.set("view engine","ejs");
app.locals.rmWhitespace = true;

// Configure to use body-parser
app.use(bodyParser.urlencoded({extended: true}));


// General index page
app.get('/', function(req, res){
    
    res.render("home"); 
    
});


app.get('/scrap', function(req, res){
    
    var scrapData = req.query.scrap_data;
    scrapData = scrapData.split(',');
    var json = {};
    var itemsProcessed = 0;
    
    forEach(scrapData, function(item, index, arr) {
        if (item.includes("https://") || item.includes("http://")) { item = item.split('://')[1]; }
        osmosis
        .get(item)
        .set({
            'title':        '.recipe-header__details-first > h1',
            'image':        '.img-container > img@src',
            'prep':         '.recipe-details__cooking-time-prep',
            'cook':         '.recipe-details__cooking-time-cook',
            'ingredients':  ['ul.ingredients-list__group > li'],
            'other_time':   '.recipe-details__cooking-time-full',
            'difficulty':   '.recipe-details__item--skill-level',
            'serves':       '.recipe-details__item--servings > span',
            'publisher':    'BBC GoodFood'
        })
        .data(function(listing) {
            json[itemsProcessed] = listing;
            itemsProcessed++;
            if(itemsProcessed === (scrapData.length)) { res.json(json); }
        });
    });    
});


// BBC Good Food - Scrap recipes - test
app.get('/test', function(req, res){
    
    osmosis
    .get('www.bbcgoodfood.com/recipes/spanish-meatball-butter-bean-stew')
    .set({
        'title':        '.recipe-header__details-first > h1',
        'image':        '.img-container > img@src',
        'prep':         '.recipe-details__cooking-time-prep',
        'cook':         '.recipe-details__cooking-time-cook',
        'ingredients':  ['ul.ingredients-list__group > li'],
        'other_time':   '.recipe-details__cooking-time-full',
        'difficulty':   '.recipe-details__item--skill-level',
        'serves':       '.recipe-details__item--servings > span',
        'publisher':    'BBC GoodFood'
    })
    .data(function(listing) {
        console.log(listing);
        res.json(listing);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
    
});
    
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("=========================");
    console.log("Web Scrap Server has started!");
    console.log("=========================");
});