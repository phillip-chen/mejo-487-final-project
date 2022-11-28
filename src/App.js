import {useEffect, useState} from 'react';
import Map from './components/Map';
import logo from './assets/nps-logo.svg';

// Dropdown
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

import ParkList from './components/ParkList';
import CustomizedDialogs from './components/PopInfoWindow';




let selectedDisplay = () => {
  if(window.location.hash===''){
    return 'CA'
  }else{
    return window.location.hash.slice(1,)
  }
}

// Define a dropdown component
let NativeSelectDemo = () => {

  // Initiate dropdown selected value
  const [selectedVal, setDropDownSelected] = useState(()=>{
    return selectedDisplay();
  });
  
  // When users selected a new state, update the url's hash value based on the state
  let queryParks = (e) => {
    window.location.hash = e.target.value
  }

  useEffect(()=>{
    window.addEventListener('hashchange', ()=>{
      setDropDownSelected(prev => prev = selectedDisplay());
    })
  },[])

  return (
  <Box sx={{ 
      minWidth: 50,
      marginLeft: 0.75,
      marginTop: 0.5
  }}>
      <FormControl fullWidth>
      <NativeSelect
          // defaultValue={selectedVal}
          value={selectedVal}
          inputProps={{
          name: 'state',
          id: 'uncontrolled-native',
          }}
          sx={{
          color: '#EF8549',
          fontSize: '1.4rem',
          fontWeight: 'bold',
          paddingLeft: '15px',
          '&::before': {
              borderBottom: '0px solid #EF8549'
          },
          '&::after': {
            borderBottom: '0px solid #EF8549'
        },
          '&:hover&::before': {
              borderBottom: '0px solid #EF8549',
          },
          '&:hover': {
            boxShadow: '0 0 10px 100px #08260a inset'
          },
            ['@media (max-width:640px)']: {
              fontSize: '1rem',
            }
          }}
          onChange={queryParks}
      >
          <option value="AL">Alabama</option>
          <option value="AK">Alaska</option>
          <option value="AZ">Arizona</option>
          <option value="AR">Arkansas</option>
          <option value="CA">California</option>
          <option value="CO">Colorado</option>
          <option value="CT">Connecticut</option>
          <option value="DE">Delaware</option>
          <option value="DC">Washington D.C</option>
          <option value="FL">Florida</option>
          <option value="GA">Georgia</option>
          <option value="HI">Hawaii</option>
          <option value="ID">Idaho</option>
          <option value="IL">Illinois</option>
          <option value="IN">Indiana</option>
          <option value="IA">Iowa</option>
          <option value="KS">Kansas</option>
          <option value="KY">Kentucky</option>
          <option value="LA">Louisiana</option>
          <option value="ME">Maine</option>
          <option value="MD">Maryland</option>
          <option value="MA">Massachusetts</option>
          <option value="MI">Michigan</option>
          <option value="MN">Minnesota</option>
          <option value="MS">Mississippi</option>
          <option value="MO">Missouri</option>
          <option value="MT">Montana</option>
          <option value="NE">Nebraska</option>
          <option value="NV">Nevada</option>
          <option value="NH">New Hampshire</option>
          <option value="NJ">New Jersey</option>
          <option value="NM">New Mexico</option>
          <option value="NY">New York</option>
          <option value="NC">North Carolina</option>
          <option value="ND">North Dakota</option>
          <option value="OH">Ohio</option>
          <option value="OK">Oklahoma</option>
          <option value="OR">Oregon</option>
          <option value="PA">Pennsylvania</option>
          <option value="RI">Rhode Island</option>
          <option value="SC">South Carolina</option>
          <option value="SD">South Dakota</option>
          <option value="TN">Tennessee</option>
          <option value="TX">Texas</option>
          <option value="UT">Utah</option>
          <option value="VT">Vermont</option>
          <option value="VA">Virginia</option>
          <option value="WA">Washington</option>
          <option value="WV">West Virginia</option>
          <option value="WI">Wisconsin</option>
          <option value="WY">Wyoming</option>
      </NativeSelect>
      </FormControl>
  </Box>
  );
}


//  Main App Component
let App = () => {

  // Initiate Parks Data State
  const [fullParkDataArr , setfullParkDataArr] = useState(()=>{
    return [];
  }); 

  // Initiate state function to open/close big modal displaying the park detailed info
  const [open, setOpen] = useState(()=>{
    return false;
  });

  // Initiate state function to open/close big modal displaying the park detailed info
  const [clickedData, setClickedData] = useState(()=>{
    return {};
  });

  // Initiate infoWindow State
  const [infoWindowOpen, setInfoWindowOpen] = useState(()=>{
    return false;
  });

   // Initiate infoWindow Location
   const [infoWindowLoc, setInfoWindowLoc] = useState(()=>{
    return({
      lat:0,
      lng:0
    })
  });

  //  Number format function (pass to park list menu & map marker's infoWindow)
  let phoneNumFormat = (park) => {

    let finalNum = null;
    let phoneNumSection = null;

    if(park.contacts.phoneNumbers.length === 0){
      return finalNum = 'Cannot be found'
    }else{
      let cleanedNum = park.contacts.phoneNumbers[0].phoneNumber.replace(/\D/g, '');
      phoneNumSection = cleanedNum.match(/^(\d{3})(\d{3})(\d{4})$/);
    }
    
    phoneNumSection === null? finalNum = 'Cannot be found' : finalNum = `(${phoneNumSection[1]}) ${phoneNumSection[2]} - ${phoneNumSection[3]}`;

    return finalNum;
  }



  return (
    <>
      <header className='flex flex-row items-center justify-between bg-nps-darkGreen w-full px-5'>
        <aside className='flex flex-row items-center justify-center'>
          <img className='inline-block w-6 2xl:w-7' src={logo} />
          <h1 className="font-title text-white hidden sm:inline-block pl-4 text-xl lg:text-2xl 2xl:text-3xl font-bold">Nearby National Parks :</h1> 
          <h1 className="font-title text-white hidden xs:inline-block sm:hidden pl-4 text-xl font-bold">NPS Map :</h1> 
          <NativeSelectDemo />
        </aside>
        <aside className='flex flex-row items-center justify-center space-x-4 w-10'>
          <ParkList fullParkDataArr={fullParkDataArr} phoneNumFormat={phoneNumFormat} setOpen={setOpen} clickedData={clickedData} setClickedData={setClickedData} setInfoWindowOpen={setInfoWindowOpen} setInfoWindowLoc={setInfoWindowLoc} />
        </aside>
      </header>
      <section id='map' className='flex flex-col justify-center items-center overflow-hidden'>
        <Map setfullParkDataArr={setfullParkDataArr} fullParkDataArr={fullParkDataArr} phoneNumFormat={phoneNumFormat} setOpen={setOpen} clickedData={clickedData} setClickedData={setClickedData} infoWindowOpen={infoWindowOpen} infoWindowLoc={infoWindowLoc} setInfoWindowLoc={setInfoWindowLoc} setInfoWindowOpen={setInfoWindowOpen}/>
      </section>
      <CustomizedDialogs phoneNumFormat={phoneNumFormat} setOpen={setOpen} open={open} clickedData={clickedData} setClickedData={setClickedData} setInfoWindowOpen={setInfoWindowOpen} setInfoWindowLoc={setInfoWindowLoc} />
      <footer className='flex flex-row items-center justify-between bg-nps-darkGreen w-full px-5'>
        <p className='text-xs xs:text-sm 2xl:text-base text-white'>&copy; The information is powered by the <a target='_blank' href='https://www.nps.gov/subjects/developer/index.htm' className=' text-nps-lightBrown hover:underline hover:underline-offset-4'>US National Park Service API</a></p>
      </footer>
    </>
  );
}

export default App;
