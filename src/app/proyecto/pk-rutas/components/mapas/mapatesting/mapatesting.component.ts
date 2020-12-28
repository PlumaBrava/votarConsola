import { Component, OnInit } from '@angular/core';
//here map
import {  ViewChild, ElementRef } from '@angular/core';

// environmet
import { environment }             from '../../../../../../environments/environment';

declare var H: any;  
@Component({
  selector: 'app-mapatesting',
  templateUrl: './mapatesting.component.html',
  styleUrls: ['./mapatesting.component.scss']
})
export class MapatestingComponent implements OnInit {
 private platform: any;
 @ViewChild("map")   public mapElement: ElementRef;
 map:any;

  private ui: any;
  public search: any;
  public lat:number=-36.28323;
  public lng:number=-62.54682;
  public query: string=null;
  public address: string = '';  
  public direccionBuscada: string = 'Bulnes 2659, Buenos Aires, Argentina';  
  constructor() { 
  	 this.platform = new H.service.Platform({
            "app_id": environment.apis.hereMaps.app_id,
            "app_code": environment.apis.hereMaps.app_code
        });

    //  this.search = new H.places.Search(this.platform.getPlacesService());
    //     this.query = "starbucks";
}

  ngOnInit() {
 

  }






public ngAfterViewInit() {
       // this.showPoint(  37.7397,  -121.4252);
       // this.showPoint(  -34.58151,  -58.40638);
       this.showPoint(  -36.28323,  -62.54682);

          // Create the parameters for the geocoding request:
// var geocodingParams = {
//       // searchText: '200 S Mathilda Ave, Sunnyvale, CA'
//       searchText: 'Alem 1385, Lincoln, argentina'
//     };   
 

//  // Get an instance of the geocoding service:
// var geocoder = this.platform.getGeocodingService();

// // Call the geocode method with the geocoding parameters,
// // the callback and an error callback function (called if a
// // communication error occurs):
// geocoder.geocode(geocodingParams, this.onResult, function(e) {
//   alert(e);
// }); 		
 

    }

showPoint(lat,lng){
  this.lat=lat;
  this.lng=lng;
   let defaultLayers = this.platform.createDefaultLayers();
        this.map = new H.Map(
            this.mapElement.nativeElement,
            defaultLayers.normal.map,
            {
                zoom: 15,
                center: { lat: lat, lng: lng }
            }
        );
    

    let   position = {
      lat: lat,
      lng:lng
    };

    let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers);

    let marker = new H.map.Marker(position);
 
    this.map.addObject(marker);
    this.setUpClickListener(this.map);


}

public setLatitud(lat){
  this.lat=lat;
}

public setLongitud(lng){
  this.lng=lng;
}

public places(query: string) {
    this.map.removeObjects(this.map.getObjects());
    // this.search.request({ "q": query, "at": this.lat + "," + this.lng }, {}, data => {
    //     for(let i = 0; i < data.results.items.length; i++) {
    //         this.dropMarker({ "lat": data.results.items[i].position[0], "lng": data.results.items[i].position[1] }, data.results.items[i]);
    //     }
    // }, error => {
    //     console.error(error);
    // });
}

private dropMarker(coordinates: any, data: any) {
    let marker = new H.map.Marker(coordinates);
    marker.setData("<p>" + data.title + "<br>" + data.vicinity + "</p>");
    marker.addEventListener('tap', event => {
        let bubble =  new H.ui.InfoBubble(event.target.getPosition(), {
            content: event.target.getData()
        });
        this.ui.addBubble(bubble);
    }, false);
    this.map.addObject(marker);
}

public setUpClickListener(map: any) {  
    let self = this;  
    this.map.addEventListener('tap', function (evt) {  
      let coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);  
      // self.lat = Math.abs(coord.lat.toFixed(4)) + ((coord.lat > 0) ? 'N' : 'S');  
      // self.lng = Math.abs(coord.lng.toFixed(4)) + ((coord.lng > 0) ? 'E' : 'W');  

       self.setLatitud(coord.lat);
       self.setLongitud(coord.lng);

      self.fetchAddress(coord.lat, coord.lng);  

    });  
  }  
  
  public fetchAddress(lat: any, lng: any): void {  
    let self = this;  
    let geocoder: any = this.platform.getGeocodingService(),  
      parameters = {  
        prox: lat + ', ' + lng + ',20',  
        mode: 'retrieveAreas',  
        gen: '9'  
      };  
  
  
    geocoder.reverseGeocode(parameters,  
      function (result) { 
      console.log(result) 
        let data = result.Response.View[0].Result[0].Location.Address;  
        self.address = data.Label + ', ' + data.City + ', Pin - ' + data.PostalCode + ' ' + data.Country; 
        self.map.setCenter( { lat: lat, lng:lng}) ;
        self.dropMarker({ lat: lat, lng:lng}, self.address);
 
      }, function (error) {  
        alert(error);  
      });  
  }  

  public buscaDireccion(direccionBuscada:string){
    let self = this;  
    console.log('direccionBuscada',direccionBuscada);
              // Create the parameters for the geocoding request:
    var geocodingParams = {
      // searchText: '200 S Mathilda Ave, Sunnyvale, CA'
      searchText: direccionBuscada
    };   
 

     // Get an instance of the geocoding service:
    var geocoder = this.platform.getGeocodingService();

      // Call the geocode method with the geocoding parameters,
      // the callback and an error callback function (called if a
      // communication error occurs):
    geocoder.geocode(geocodingParams,
       function(result) {
          console.log(this);
          console.log(self);
          console.log(result);
          self.map.removeObjects(self.map.getObjects());
          if(result.Response.View.lenth==0) {
               alert('respuesta sin datos');
            console.log('respuesta sin datos');
            return;
          }
          var locations = result.Response.View[0].Result,
            position,
            marker;
          var dir;    
    
          // Add a marker for each location found
          for (var i = 0;  i < locations.length; i++) {

            console.log('location',locations[i]);
            position = {
              lat: locations[i].Location.DisplayPosition.Latitude,
              lng: locations[i].Location.DisplayPosition.Longitude
            };
            self.setLatitud(position.lat);
            self.setLongitud(position.lng);
            dir= locations[i].Location.Address.Label;
            self.map.setCenter(position) ;
            

            self.dropMarker(position, dir);

    

     }} ,function(e) {
          alert(e);
        }
    );     
  }



}
