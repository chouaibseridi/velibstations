      var lon = document.getElementsByTagName("locationLon")[0].getAttribute("name");
      var lat = document.getElementsByTagName("locationLat")[0].getAttribute("name");
      var stations = JSON.parse(document.getElementsByTagName("input")[0].getAttribute("value"));
      var zoom = document.getElementsByTagName("zoom")[0].getAttribute("name");

      var map = new ol.Map({
      target: 'map',
      layers: [
      new ol.layer.Tile({
      source: new ol.source.OSM()
      })
      ],
      view: new ol.View({
      center: ol.proj.fromLonLat([lon, lat]),
      zoom: zoom
      })
      });
      if (zoom == 17)
      var markerOrigin = new ol.Feature({
        geometry: new ol.geom.Point(
        ol.proj.fromLonLat([lon,lat])
      ),
      });

      var vectorSource1 = new ol.source.Vector({
        features: [markerOrigin]
      });

      var iconStyle1 = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 1,
            src: 'https://i.ibb.co/QFFmtxm/marker.png'
        }))
        });

      var markerVectorLayer1 = new ol.layer.Vector({
        source: vectorSource1,
        style: iconStyle1
      });

      map.addLayer(markerVectorLayer1);      

      var markers = [];
      
      stations.forEach(station => {
        var marker = new ol.Feature({
        geometry: new ol.geom.Point(
        ol.proj.fromLonLat([station.longitude,station.latitude])
      ),
        name : station.station
      });
      
      markers.push(marker);

      }); 

      var vectorSource2 = new ol.source.Vector({
        features: markers
      });
      
      var iconStyle2 = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 1,
            src: 'https://i.ibb.co/SPzJpZ0/velibmarker.png'
        }))
        });

      var markerVectorLayer2 = new ol.layer.Vector({
        source: vectorSource2,
        style: iconStyle2
      });

      map.addLayer(markerVectorLayer2);



      var mapSearch = new ol.Map({
        target: 'mapSearch',
        layers: [
        new ol.layer.Tile({
        source: new ol.source.OSM()
        })
        ],
        view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 2
        })
        });
        