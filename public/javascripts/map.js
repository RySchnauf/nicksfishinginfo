// Initialize and add the map
function initMap() {
    //both temp and discharge
    var tempAndDischargeURL = "https://waterservices.usgs.gov/nwis/iv/?parameterCd=00060,00010&indent=on&sites=01425000,01426500,01425805,01417000,01420500,01417500,01421000,01427207,01427510&format=json"
    var tempAndDischarge = new XMLHttpRequest();
    tempAndDischarge.open("GET", tempAndDischargeURL);

    tempAndDischarge.setRequestHeader("Accept", "application/json");

    var tempOnlyURL = "https://waterservices.usgs.gov/nwis/iv/?parameterCd=00060,00010&indent=on&sites=01427000&format=json"
    var tempOnly = new XMLHttpRequest();
    tempOnly.open("GET", tempOnlyURL);

    tempOnly.setRequestHeader("Accept", "application/json");

    const center = { lat: 41.95, lng: -75.2 };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 11,
        center: center,
    });

    tempAndDischarge.onreadystatechange = function () {
        if (tempAndDischarge.readyState === 4) {
           var jsonRes = JSON.parse(tempAndDischarge.responseText)
           var timeSeries = jsonRes.value.timeSeries
           console.log(timeSeries);
            for(var i = 0; i*2 < timeSeries.length; i++){
                counter = i*2
                const position = { lat: timeSeries[counter].sourceInfo.geoLocation.geogLocation.latitude, lng: timeSeries[counter].sourceInfo.geoLocation.geogLocation.longitude };
                const marker = new google.maps.Marker({
                    position: position,
                    map: map,
                  });

                  var tempC = parseInt(timeSeries[counter].values[0].value[0].value)
                  
                  var DischargeRate = timeSeries[counter+1].values[0].value[0].value

                  console.log(timeSeries[counter].variable.variableName)
                  if(timeSeries[counter].variable.variableName.includes("Streamflow")){
                     tempC = parseInt(timeSeries[counter+1].values[0].value[0].value)
                     DischargeRate = timeSeries[counter].values[0].value[0].value
                     console.log("swapped")
                  }

                  var tempF = (tempC * (9/5)) + 32

                  const contentString =
                    '<div id="content">' +
                    '<h3 id="firstHeading" class="firstHeading">'+ timeSeries[counter].sourceInfo.siteName +'</h1>' +
                    '<div id="bodyContent">' +
                    "<p><b>Temp Deg F: </b>" + tempF + "<br />" +
                    "<b>Discharge Rate: </b>" + DischargeRate + "</p>"
                    "</div>" +
                    "</div>";

                  const infowindow = new google.maps.InfoWindow({
                    content: contentString
                  });
                  google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, this);
                  });
            }
            



        }};
    tempAndDischarge.send();

    tempOnly.onreadystatechange = function () {
        if (tempOnly.readyState === 4) {
           var jsonRes = JSON.parse(tempOnly.responseText)
           var timeSeries = jsonRes.value.timeSeries
           console.log(timeSeries);
           for(var i = 0; i < timeSeries.length; i++){
            const position = { lat: timeSeries[i].sourceInfo.geoLocation.geogLocation.latitude, lng: timeSeries[i].sourceInfo.geoLocation.geogLocation.longitude };
            const marker = new google.maps.Marker({
                position: position,
                map: map,
            });
        
            var tempC = parseInt(timeSeries[i].values[0].value[0].value)
            var tempF = (tempC * (9/5)) + 32
        
            const contentString =
                '<div id="content">' +
                '<h3 id="firstHeading" class="firstHeading">'+ timeSeries[i].sourceInfo.siteName +'</h1>' +
                '<div id="bodyContent">' +
                "<p><b>Temp Deg F: </b>" + tempF + "</p>"
                "</div>" +
                "</div>";
        
            const infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, this);
            });
        }

        }};
    tempOnly.send();

  }