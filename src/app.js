console.log('Wind forecast for the Berkeley Marina thanks tosimply.js, CalSailing and kimonolabs');

//Pebble app configuration
simply.fullscreen(false); 
simply.scrollable(true);//for the menu screen set to false
simply.style('small'); //use smallest text
var apptitle = "Berkeley Wind";
var api_key = "e0410419639a90c0e2ac742009fffaf6";//kimono
var api_route = "cs24p888";
 
var notrequesting = true;
var status = null;//timers for both status while requesting the feed and for updating the feed
var ipending = 0; //nbr of period
var currentstatus = "";

simply.on('singleClick', function(e) {
  console.log('Pressed ' + e.button + '!');
  if (e.button === 'back') {
    clearInterval(feedtimer);
    console.log('Timer OFF');
  } 

});

startapp();

function setstatus(st) {
  simply.title(apptitle + st);
  console.log('status:'+ st);
  if(status)
  {
    clearInterval(status);
    console.log("clear status");
  }
  if(st)
  {
    currentstatus = apptitle + st; //stored the current status
    status = setInterval(function()
      {
        ipending++;
        if(ipending > 4)
          currentstatus = currentstatus.substr(0, currentstatus.length - 4);
        else
        {
          currentstatus = currentstatus + ".";
        }
        console.log('status interval:' + ipending + '-'+ currentstatus);
        simply.title(currentstatus);
      }, 500);
  }
  else
    simply.title(apptitle);
}

function startapp() {
  setstatus("   ");
  notrequesting = false;
  var api_url = 'http://www.kimonolabs.com/api/'+ api_route+ '?apikey='+ api_key;
  ajax({ url: api_url  }, function(data){
    var news = JSON.parse(data);
    var arr = news.results.current;
    var temperature ="";
    var forecast ='';
    for(var i=0;i<15 && i<arr.length;i++){
      if(arr[i]["wind"])
        simply.subtitle(arr[i]["wind"]["text"].replace(/\([^\)]+\)/g,""));
      else if(arr[i]["temp"])
        temperature = arr[i]["temp"];
      else
        forecast += arr[i]["forecast_wind"]+ '\n';
    }
    setstatus("");
    notrequesting = true;
    simply.body(temperature + '\n' + forecast);
  });
}
