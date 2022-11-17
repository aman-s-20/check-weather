const express = require('express')
const app = express()
const bodyParser =require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
const https = require("https");
app.set('view engine', 'ejs');
app.use(express.static("public") );
app.get("/",function(req,res) {
    res.render('result',{
        temperatute : "",
        statusCode : 200,
        cityName : ""
    });
})
app.post("/",function(req,res){
    console.log(req.body.city);
    let city=(req.body.city).toLowerCase();
    if( city === "")
    {
        res.sendFile(__dirname + "/failure.html");
        return;
    }
    city  = city[0].toUpperCase() + city.substring(1);
    
    const query = city;
    const appid= "acf9e7b35371c2fa37489dfe6ec41631"
    const unit = "metric";
    const url="https://api.openweathermap.org/data/2.5/weather?q="+ query+ "&appid="+ appid +"&units=" + unit;
    https.get(url,function(response) {
       console.log(response.statusCode); 
       response.on("data",function(data){
       const WeatherData = JSON.parse(data);
       

        if(response.statusCode === 200)
        {
        var iconurl = "http://openweathermap.org/img/w/" + WeatherData.weather[0].icon + ".png";
      
        res.render('result',{
            temperatute : WeatherData.main.temp,
            statusCode :(response.statusCode),
            cityName : WeatherData.name,
            description : WeatherData.weather[0].description,
            humidity : WeatherData.main.humidity,
            pressure : WeatherData.main.pressure,
            windSpeed : WeatherData.wind.speed,
            visibility : WeatherData.visibility,
            clouds : WeatherData.clouds.all,
            icon : iconurl,
            country : WeatherData.sys.country,
            longitude : WeatherData.coord.lon,
            latitude : WeatherData.coord.lat,
            
            
        });
        } 
        else {
              res.sendFile(__dirname + "/failure.html");
        }
       })
    })
    
    
})
app.post("/failure",function(req,res) {
    res.redirect("/");
})
app.listen(process.env.PORT || 3000 , function() {
    console.log("Server is Running On Port 3000")
})