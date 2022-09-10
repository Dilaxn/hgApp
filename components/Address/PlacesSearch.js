import React from "react";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const PlacesSearch = ({ onChange }) => (

    <GooglePlacesAutocomplete
        placeholder='Search location on map'
        onPress={(data, details = null) => {
            onChange(details.geometry.location.lat, details.geometry.location.lng);
        }}
        fetchDetails={true}
        query={{
            key: 'AIzaSyC9BcyoxhP659a99NdfW2xuVkSIy2KsZcs',
            language: 'en',
            //components: 'country:ae',
        }}
        styles={{
            textInput: {
                //height: 40,
                borderColor: '#ccc',
                borderWidth: 1,
                borderRadius: 10,
                zIndex: 1111
            },
            textInputContainer: {
                //backgroundColor: 'grey',
            },
        }}
    />

);

export default PlacesSearch;
