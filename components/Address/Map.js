import React from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const MAP_STYLE = [{"elementType":"geometry","stylers":[{"color":"#242f3e"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#746855"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#242f3e"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#263c3f"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#6b9a76"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#38414e"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#212a37"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#9ca5b3"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#746855"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#1f2835"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#f3d19c"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2f3948"}]},{"featureType":"transit.station","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#17263c"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#515c6d"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#17263c"}]},{"region":"AE"}];

export default function Map({ onChange, location }) {

    const handleLocationChange = (event) => {
        const lat = event.nativeEvent.coordinate.latitude;
        const lng = event.nativeEvent.coordinate.longitude;
        onChange({lat, lng});
    };

    return (
        <MapView
            style={{ width: '100%', height: 220 }}
            initialRegion={{
                latitude: location.lat,
                longitude: location.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
            provider={PROVIDER_GOOGLE}
            tappable={true}
            customMapStyle={MAP_STYLE}
        >
            <Marker 
                coordinate={{
                    latitude: location.lat,
                    longitude: location.lng
                }} 
                draggable
                tappable={true}
                onDragEnd={handleLocationChange}
            />
        </MapView>             
    );
};

