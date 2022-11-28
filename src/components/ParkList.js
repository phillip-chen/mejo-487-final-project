import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import Tooltip from '@mui/material/Tooltip';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import Button from '@mui/material/Button';

import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';

import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';





let ParkList = ({fullParkDataArr, phoneNumFormat, setOpen, clickedData, setClickedData, setInfoWindowOpen, setInfoWindowLoc}) => {
  const [state, setState] = React.useState({
    right: false,
  });

  // Define a function to toggle on/off the drawer menu
  const toggleDrawer = (anchor, open) => (event) => {
    // Close infoWindow
    setInfoWindowOpen(false);
   
    
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      console.log('clicked')
      return;
    }
   

    setState({ ...state, [anchor]: open });
  };

  // Define a function to show the location's infoWindow when users click on the location icon
  let listShowLoc = (e) => {

    let data = JSON.parse(e.target.getAttribute('name'));

    setInfoWindowLoc(prevLoc => ({...prevLoc, ...{lat: Number(data.lat),lng: Number(data.lng) }}));
    setInfoWindowOpen(true);
    // Close the drawer
    setState({ ...state, 'right': false })
  }

  //  Setup pop up window header  
  function BootstrapDialogTitle(props) {
    const { children, ...other } = props;

    return (
        <DialogTitle sx={{ position:'relative', zIndex:'999', width:'100%', height:'100%' , m: '0 0 0 0', p: '2 0 0 2', color:'#16411A', fontSize:'24px',fontWeight:'bold', background:'#f1f1f1' }} {...other}>
          {children}
          <IconButton
          aria-label="close"
          onClick={toggleDrawer('right', false)}
          onKeyDown={toggleDrawer('right', false)}
          className='park-list-close-btn'
          sx={{
              color: (theme) => theme.palette.grey[500],
          }}
          >
          <CloseIcon />
          </IconButton>
        </DialogTitle>
    );
  }

  const list = (anchor) => (
    <Box
      className='drawer'
      role="presentation"
      // onClick={toggleDrawer('right', false)}
    >
      <section className='parklist-header-container'>
        <BootstrapDialogTitle id="customized-dialog-title" 
        >
          <div className='parklist-header-sub-container'>
            {fullParkDataArr.length} parks found  near <span className='parklist-title-highlight'>{window.location.hash===''? 'CA' : window.location.hash.slice(1,)}</span>
          </div>
        </BootstrapDialogTitle>
      </section>
      {/* Loop through the queried parks results and create a list of park info cards */}
        {fullParkDataArr.map((park, index) => (
            <>
                <List className='park-list-item' key={park.fullName+`-${index}-`}>
                    <ListItem key={park.id} disablePadding sx={{
                      display:'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignContent: 'center',
                      marginTop: '20px',
                    }}>
                        {/* Park Content */}  
                        <h1 className='park-list-title'>{park.fullName}</h1>
                        <img src={park.images[0].url} className='park-list-img' />
                        <ul className='infoWindow-content park-list'>
                          <li><span className='infoWindow-text-bold'>Designation : </span>{park.designation===''?'Unclassified Park':park.designation}</li>
                          <li><span className='infoWindow-text-bold'>Address : </span>{park.addresses[0].line1 + ', ' + park.addresses[0].city + ', ' + park.addresses[0].stateCode + ', ' + park.addresses[0].postalCode}</li>
                          <li><span className='infoWindow-text-bold'>Phone : </span>{phoneNumFormat(park)}</li>
                          <li><span className='infoWindow-text-bold'>Email : </span><a className='infoWindow-link' href={`mailto:${park.contacts.emailAddresses[0].emailAddress}`}>{park.contacts.emailAddresses[0].emailAddress}</a></li>
                          <li className='infoWindow-btn-container'>
                            <Button variant="contained" sx={{ background:'#297A31', '&:hover': {background:'#16411A'}, marginTop:'0px',  fontSize: '14px'}}><a target='_blank' href={park.url}>Visit Site</a></Button>
                            <Button variant="contained" sx={{ background:'#297A31', '&:hover': {background:'#16411A'}, marginTop:'0px', marginLeft: '10px', marginRight: '5px', fontSize: '14px', ['@media (max-width:560px)']:{marginTop:'10px', marginLeft: '0px', marginBottom:'10px'}}} name={JSON.stringify(park)} 
                            
                            onClick={(e)=>{ 
                              // If click on 'more info' button, reset the clicked data
                              setClickedData({});

                              // Open up a window cover the center of page showing more detailed info of the clicked park
                              setOpen(true);
                              
                              // Update the clicked data
                              setClickedData(prev=>(
                                {
                                  ...prev,
                                  ...JSON.parse(e.target.getAttribute('name'))
                                }
                              ));

                              // Close the menu drawer
                              setState({ ...state, [anchor]: false })
                              
                            }}>More Info</Button>
                            <Tooltip title="See site's location on the map" placement="right" name={`{"lat":${park.latitude},"lng":${park.longitude}}`}>
                                <Button className='location-icon-btn' sx={{color:'#EE4B2B'}} onClick={(e)=>{
                                  // If user click on the location icon, trigger the function to show the location's infoWindow
                                  listShowLoc(e);
                                }}>
                                </Button>
                            </Tooltip>
                          </li>
                        </ul>
                    </ListItem>
                </List>
                {fullParkDataArr.length-1 === index? <></>:<Divider key={String(park.id)+String(`-${index}`)} />}
            </>
        ))}
    </Box>
  );

  return (
        <React.Fragment key={'right'}>
            <Tooltip title="See full list of parks" placement="bottom">
                {/* <Button>left</Button> */}
                <Button onClick={toggleDrawer('right', true)} variant="contained" sx={{
                background:'#0d3610',
                padding:'auto 2px',
                  "&:hover":{
                      background:'#08260a'
                  },
                  width:'100%'
                }}>
                    <DensityMediumIcon />
                </Button>
            </Tooltip>
            <Drawer
            anchor={'right'}
            open={state['right']}
            onClose={toggleDrawer('right', false)}
            >
              {/* Execute the function to loop through a list of returned parks info, storing in a list of items */}
              {list('right')}
            </Drawer>
        </React.Fragment>
  );
}

export default ParkList;