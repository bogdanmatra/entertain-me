## bogdanmatra.github.io

### Entertain Me

A simple single page application which shows the coolest venues around your location (using Foursquare API):
* https://developer.foursquare.com/docs/api/venues/explore
* https://developer.foursquare.com/docs/api/configuration/authentication

### Feature list
* The user enters the website (https://bogdanmatra.github.io/) and is prompted to share his geolocation.
* If the user agrees then the autocomplete placeholder (first input on the page) will be populated with his geolocation name.
* If the user does no agree, the placeholder will show "Choose a place...".
* The user can choose a different place using the Google Maps Autocomplete component.
* The user can change the radius of his search and the types of venues he wants to see.
* While the application is querying the Foursquare API, a loader is shown.



### Application Structure
```
FoursquareConstants     $http
        \               /
        FoursquareAPIService    $window (Used for current geolocation approval and Google Maps API)
                \               /
                VenuesController
```

Most of the application logic is in the `VenuesController.js` file. Based on the user changes in `venues-filters.html` the `venues-list.html` is updated.

### Technical references

Framework used:
* Angular JS: https://code.angularjs.org/1.5.11/docs/guide/concepts

Other 3rd party libraries:
* Bootstrap CSS: https://getbootstrap.com/
* Google Maps API: https://cloud.google.com/maps-platform/
* Google Maps Autocomplete adapter for Angular JS: https://github.com/jvandemo/angularjs-google-maps
* Loader inspired from: https://www.w3schools.com/howto/howto_css_loader.asp
* Favicon: https://favicon.io/emoji-favicons/partying-face/