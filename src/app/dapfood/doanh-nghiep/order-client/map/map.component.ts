import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  map;
  markers;

  async initMap(datas) {

    const lstLag0 = datas.path[0];
    if (!this.map) {
      this.map = L.map('map', {
        center: [lstLag0.lat, lstLag0.lng],
        zoom: 13
      });
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
        attribution: 'DapFood.com - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
      tiles.addTo(this.map);
    } else {

    }

    var HomeIcon = L.icon({
      iconUrl: 'https://cdn.iconscout.com/icon/premium/png-64-thumb/location-pin-marker-gps-map-optimization-place-1-11288.png',
      iconSize: [40, 50],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      //shadowUrl: '/src/assets/leaflet/images/marker-shadow.png',
      //shadowSize: [68, 95],
      //shadowAnchor: [22, 94]
    });
    var myIcon = L.icon({
      iconUrl: 'https://cdn.iconscout.com/icon/premium/png-64-thumb/location-3091991-2574351.png',
      iconSize: [30, 40],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      //shadowUrl: '/src/assets/leaflet/images/marker-shadow.png',
      //shadowSize: [68, 95],
      //shadowAnchor: [22, 94]
    });
    var i = 0;
    var lstMarker: any[] = [];
    for await (const item of datas.path) {
      i += 1;
      //var lstLag = await this.decodePolyline(item.polyline_points);
      if (i == 1) {
        //lstMarker.push(L.marker([lstLag[0].lat, lstLag[0].lng], { icon: i == 1 ? HomeIcon : myIcon }).addTo(this.map).bindPopup("<b>" + item.name + "- " + item.mobile + "</b><br>" + item.address).openPopup());
        lstMarker.push(L.marker([item.lat, item.lng], { icon: i == 1 ? HomeIcon : myIcon }).addTo(this.map).bindPopup("<b>" + item.name + "- " + item.mobile + "</b><br>" + item.address).openPopup());
      } else {
        //lstMarker.push(L.marker([lstLag[0].lat, lstLag[0].lng], { icon: i == 1 ? HomeIcon : myIcon }).addTo(this.map).bindPopup("<b>" + item.name + "- " + item.mobile + "</b><br>" + item.address));
        lstMarker.push(L.marker([item.lat, item.lng], { icon: i == 1 ? HomeIcon : myIcon }).addTo(this.map).bindPopup("<b>" + item.name + "- " + item.mobile + "</b><br>" + item.address));
      }
    }
    this.markers = L.layerGroup(lstMarker).addTo(this.map);
    var latlang = await this.decodePolylineList(datas.estimateOrder.polyline_points);
    var multiPolyLineOptions = { color: 'red' };
    var multipolyline = L.polyline(latlang, multiPolyLineOptions);
    multipolyline.addTo(this.map);
  }

  constructor() { }

  ngAfterViewInit(): void {

  }

  async showMap(datas) {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.markers = [];
    }
    await this.initMap(datas);
  }

  async closeMap() {
    this.map.removeLayer(this.markers);
  }

  async getCoordinates(address) {
    var poly: any;
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + '&key=AIzaSyDCcp0CPd9W2GcTepLnCLtP_vmpFqWijVg')
      .then(response => response.json())
      .then(data => {
        const latitude = data.results.geometry.location.lat;
        const longitude = data.results.geometry.location.lng;
        poly.lat = latitude;
        poly.lng = longitude;
        return poly;
      })
  }

  async decodePolyline(encoded) {
    if (!encoded) {
      return [];
    }
    var poly = [];
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;

    while (index < len) {
      var b, shift = 0, result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result = result | ((b & 0x1f) << shift);
        shift += 5;
      } while (b >= 0x20);

      var dlat = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result = result | ((b & 0x1f) << shift);
        shift += 5;
      } while (b >= 0x20);

      var dlng = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
      lng += dlng;

      var p = {
        lat: lat / 1e5,
        lng: lng / 1e5,
      };
      poly.push(p);
    }
    return poly;
  }

  async decodePolylineList(encoded) {
    if (!encoded) {
      return [];
    }
    var poly = [];
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;

    while (index < len) {
      var b, shift = 0, result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result = result | ((b & 0x1f) << shift);
        shift += 5;
      } while (b >= 0x20);

      var dlat = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result = result | ((b & 0x1f) << shift);
        shift += 5;
      } while (b >= 0x20);

      var dlng = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
      lng += dlng;

      var p = [lat / 1e5, lng / 1e5];
      poly.push(p);
    }
    return [poly];
  }

}