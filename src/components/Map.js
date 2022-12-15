import React from 'react';
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF} from '@react-google-maps/api';
import parkMarker from '../assets/nps-logo.svg';

// Load in state's lat/lng data for the map to match state's center location every time users make an update.
import stateData from '../assets/stateData';
import Button from '@mui/material/Button';


// css styling
const containerStyle = {
  width: '100%',
  height: '100%',
  // borderRadius: '4px'
  // position: 'absolute',
};

// Define center location of the map
const center = () => {
  let data = stateData.filter(d => {
    if(window.location.hash === '') 
    {return d.state === 'CA';}else{
      return '#'+d.state === window.location.hash;
    }
  });
  
  return {
    lat: data[0].lat,
    lng: data[0].lng
  }
}

// Define an var to store map's center location
let centerLoc = center();






// Map Component
let Map = ({setfullParkDataArr,fullParkDataArr, phoneNumFormat, setOpen, clickedData, setClickedData, infoWindowOpen, infoWindowLoc, setInfoWindowLoc, setInfoWindowOpen}) => {
  // Initiate Parks Data State
  const [mapZoom, setMapZoom] = useState(()=>{
    return 6;
  }); 

  // Initiate Markers State
  const [parkArr, queryParks] = useState(()=>{
      return [];
  });

  


  // Open up infoWindow
  const showInfoWindow = (data) => {

      setInfoWindowLoc({});
      setInfoWindowOpen(true);
      // Update the location state of the infoWindow
      setInfoWindowLoc(prevLoc => ({...prevLoc, ...{lat: Number(data.latLng.lat()),lng: Number(data.latLng.lng()) }}))
  };

  // infoWindow Content
  let infoWindowContent = () => {
    
    let data = fullParkDataArr.filter(d => 

      // Use the clicked marker's returned lat/lng value to match the lat/lng values from the queried parks data list
      // (Rounds up the lat/lng number and goes as far as 4 decimal points to ensure match accuracy)
      Math.floor(Number(d.longitude)*10000)/10000 === Math.floor(Number(infoWindowLoc.lng)*10000)/10000 &&
      Math.floor(Number(d.latitude)*10000)/10000 === Math.floor(Number(infoWindowLoc.lat)*10000)/10000
    
    )

    return (
      <>

        <h1 className='infoWindow-title'>{data[0].fullName}</h1>
        <ul className='infoWindow-content'>
          <li><span className='infoWindow-text-bold'>Designation : </span>{data[0].designation===''?'Unclassified Park':data[0].designation}</li>
          <li><span className='infoWindow-text-bold'>Address : </span>{data[0].addresses[0].line1 + ', ' + data[0].addresses[0].city + ', ' + data[0].addresses[0].stateCode + ', ' + data[0].addresses[0].postalCode}</li>
          <li><span className='infoWindow-text-bold'>Phone : </span>{phoneNumFormat(data[0])}</li>
          <li><span className='infoWindow-text-bold'>Email : </span><a className='infoWindow-link' href={`mailto:${data[0].contacts.emailAddresses[0].emailAddress}`}>{data[0].contacts.emailAddresses[0].emailAddress}</a></li>
          <li className='infoWindow-btn-container'>
            <Button variant="contained" sx={{ background:'#297A31', '&:hover': {background:'#16411A'}, marginTop:'0px',  fontSize: '14px'}}><a target='_blank' href={data[0].url}>Visit Site</a></Button>
            <Button variant="contained" sx={{ background:'#297A31', '&:hover': {background:'#16411A'}, marginTop:'0px', marginLeft: '10px', fontSize: '14px', ['@media (max-width:560px)']:{marginTop:'10px', marginLeft: '0px'}}} data={JSON.stringify(data[0])} onClick={(e)=>{
              // If click on 'more info' button, reset the clicked data
              setClickedData({});

              // Open up a window cover the center of page showing more detailed info of the clicked park
              setOpen(true);

              // Close the infoWindow on click the 'more info' buttton
              setInfoWindowOpen(false);

              // If click on 'more info' button, reset the infoWindow location
              setInfoWindowLoc({});

               // Update the clicked data
              setClickedData(prev=>(
                {
                  ...prev,
                  ...JSON.parse(e.target.getAttribute('data'))
                }
              ))
            }}>More Info</Button>
          </li>
        </ul>
      </>
    )

  }

  // Handle map change evnt
  function handleZoomChange() {
    //  Update map zoom level
    setMapZoom(prev => prev = this.zoom);
  }
  

  // Fetch park data
  let queryParkAPI = () => {
      
      queryParks([])

      // Get User's current location
      // Define API request
      const apiKey = '[Your NPS API Key]'
      
      let url =null;

      if(window.location.hash === ''){
        url = `https://developer.nps.gov/api/v1/parks?stateCode=ca&api_key=${apiKey}`;
      }else{
        url = `https://developer.nps.gov/api/v1/parks?stateCode=${window.location.hash.slice(1,).toLocaleLowerCase()}&api_key=${apiKey}`;
      }

      // Fetch Campsite geo data from National Park Service API

      fetch(url)
        .then(response => response.json())
        .then(data => {

          // fullParkDataArr = [];
          setfullParkDataArr([])

          // loop through the queried parks data list and add 1 location marker per park
          for(let park of data.data){       
            queryParks(prevParkArr => [...prevParkArr,
                <MarkerF
                  onClick = {showInfoWindow}
                  icon={{
                    url:parkMarker,
                    scaledSize: new window.google.maps.Size(50, 50)
                  }}
                  title={park.fullName}
                  position={{
                    lat: Number(park.latitude),
                    lng: Number(park.longitude)
                  }}
                  key={park.id}
                />
              ]
            )
            setfullParkDataArr(prev => ([...prev, park]))
          }
        })
  }

  // Execude the code upon components have mounted
  useEffect(()=>{

    // Query the parks data (default is "CA" state)
    queryParkAPI();

    // Every time users pick a new state, it'll update the location.hash value on the url,
    // Add a event listener to the window and rerender the page contents based on the new selected state whenever the hash value have been changed
    window.addEventListener('hashchange', ()=>{
      // Query new data
      queryParkAPI();

      // Change map center
      centerLoc = center();

      // Close InfoWindow
      setInfoWindowOpen(false);

      //  Reset map zoom level
      setMapZoom(prev => prev = 6);

    })
  }, []);
  


  return (
    <LoadScript
      googleMapsApiKey = '[Your Google API Key]'
    >
      <GoogleMap
        mapContainerStyle={containerStyle}

        // Use state to track map center location, every time users pick a new state, the center will be updated to the central lat/lng value of that state
        center={centerLoc}

         // Use state to track zoom level, every time users pick a new state, the zoom level will be reset to 6
        zoom={mapZoom}

        // Cusotomize Google Map Styling
        options={{
          styles:[
            {elementType: 'geometry', stylers: [{lightness:-50}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#333333'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#ffffff'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#c4c4c4'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#D18559'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#FFD0B5'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{lightness:-10}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{lightness:-50}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{lightness:-10}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{lightness:-50}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#4B9CD3'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            },
          ],

          // Define min/max zoom level
            minZoom:4,
            maxZoom:15
          
        }}

        // Disable click actions to avoid unwanted actions
        clickableIcons = {false}

        // When users zoom in/out, update the current zoom level in the React state
        onZoomChanged = {handleZoomChange}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        {parkArr}
        {infoWindowOpen && (
            <InfoWindowF position={infoWindowLoc} onCloseClick={() => setInfoWindowOpen(false)}>
              {/* full name */}
              {infoWindowContent()}
            </InfoWindowF>
        )}
      </GoogleMap>
    </LoadScript>
  )
}

export default React.memo(Map)
