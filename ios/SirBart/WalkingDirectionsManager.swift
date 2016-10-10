import MapKit


let SharedWalkingDirectionsManager = WalkingDirectionsManager()

protocol WalkingDirectionsDelegate {
  func handleWalkingDistance(_ stationCode:String, distance:Int, time:Int)
}

@objc (WalkingDirectionsManager)
class WalkingDirectionsManager: NSObject {
  
  var delegate : WalkingDirectionsDelegate?
  
  class var manager: WalkingDirectionsManager {
    return SharedWalkingDirectionsManager
  }
  
  func loc2dToMapItem(_ loc:CLLocationCoordinate2D) -> MKMapItem {
    let mapItem = MKMapItem(placemark: MKPlacemark(coordinate: loc, addressDictionary: nil))
    return mapItem
  }
  
  @objc func getWalkingDirectionsBetween(_ startLat: Double, startLng: Double, endLat: Double, endLng: Double, resolver: @escaping RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
    let startLatLon:CLLocationCoordinate2D = CLLocationCoordinate2D.init(latitude: CLLocationDegrees.init(startLat), longitude: CLLocationDegrees.init(startLng))
    let endLatLon:CLLocationCoordinate2D = CLLocationCoordinate2D.init(latitude: CLLocationDegrees.init(endLat), longitude: CLLocationDegrees.init(endLng))

    let walkingRouteRequest = MKDirectionsRequest()
    walkingRouteRequest.transportType = MKDirectionsTransportType.walking
    
    let sourceMapItem = loc2dToMapItem(startLatLon)
    let endMapItem = loc2dToMapItem(endLatLon)
    walkingRouteRequest.source = sourceMapItem
    walkingRouteRequest.destination = endMapItem
    
    let walkingRouteDirections = MKDirections(request: walkingRouteRequest)
    walkingRouteDirections.calculate { (response: MKDirectionsResponse?, error: Error?) in
      if let distance = response?.routes[0].distance, let time = response?.routes[0].expectedTravelTime {
        resolver(["distance": Int(distance), "time": Int(time / 60)])
      }
    }
  }
}
