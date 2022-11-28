import { useState } from 'react';
import PropTypes from 'prop-types';

// Import Material UI styled Dialog / Icons / Typography / Accordin / Tooltip components
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import LocationOnIcon from '@mui/icons-material/LocationOn';

// Import Material UI styled carousel components
import Carousel from 'react-material-ui-carousel';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';


//  Setup pop up window header components & styling
function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2, color:'#16411A' }} {...other}>
        {children}
        {onClose ? (
            <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
            }}
            >
            <CloseIcon />
            </IconButton>
        ) : null}
        </DialogTitle>
    );
}

//  Define window header component's prop types
BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs({phoneNumFormat, setOpen, open, clickedData, setClickedData, setInfoWindowOpen, setInfoWindowLoc}) {

    // Define a function to close the pop up window showing the detailed info of the clicked park
    const handleClose = () => {
        setOpen(false);
        setClickedData({});
        // reset according expanded panel to the first one
        setExpanded(prev => prev = 'panel1');
    };

    // state and functions for the accordin items
    const [expanded, setExpanded] = useState(()=>{
        return 'panel1'
    });

    // Define a function to expand/collapsed the information per section in the pop-up window
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    // Initiate an array to hold site's activities
    let todos = [];
    if(open){
        clickedData.activities.map(d => {
            return todos.push(d.name);
        });
    }else{
        todos = [...[]];
    }

    // Initiate an array to hold site's featured topics
    let topics = [];
    if(open){
        clickedData.topics.map(d => {
            return topics.push(d.name);
        });
    }else{
        topics = [...[]];
    }

    // Define a function to show the location's infoWindow when users click on the location icon
    let showLoc = () => {
        setInfoWindowOpen(true);
        setInfoWindowLoc({
            lat:0,
            lng:0
          })
        setInfoWindowLoc(prevLoc => ({...prevLoc, ...{lat: Number(clickedData.latitude),lng: Number(clickedData.longitude) }}))
        handleClose();
    }

    // console.log(clickedData);


    // Render only when user click the "more info" button to load data in
    if(clickedData.fullName === undefined){
        return
    }else{
        return (
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-popwindow-title"
                open={open}
                maxWidth='md'
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <div className='popup-infoWindow-title-container'>
                        <Tooltip title="See site's location on the map" placement="left">
                            <IconButton sx={{color:'#EE4B2B', padding:'0px'}} onClick={showLoc}>
                                <LocationOnIcon className='loc-icon'/>
                            </IconButton>
                        </Tooltip>
                        <Typography sx={{color:'#99542C', fontSize:'.9rem', lineHeight:'1.4rem'}}>
                                {clickedData.designation === '' ? 'Unclassified Park' : clickedData.designation}
                        </Typography>
                    </div>
                    
                    <Tooltip title="Visit The Site's Website" placement="right">
                        <a className='popup-infoWindow-title' target='_blank' href={clickedData.url}>{clickedData.fullName}</a>
                    </Tooltip>
                   
                </BootstrapDialogTitle>
                <DialogContent dividers>
                <section className='carousel-container'>
                    <Carousel
                        NextIcon={<KeyboardArrowRightIcon/>}
                        PrevIcon={<KeyboardArrowLeftIcon/>}
                        autoPlay = {false}
                        navButtonsAlwaysVisible = {true}
                        className = 'carousel-main'
                    >
                        {
                            clickedData.images.map(img=>{
                                return(
                                    <div className='img-container'>
                                        <img src={img.url} className='pop-window-img' key={img.url} alt={img.title} />
                                        <p className='img-caption'>{img.caption}</p>
                                    </div>
                                );
                            })
                        }
                    </Carousel>
                </section>
                
                <Accordion sx={{marginTop:'10px'}} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="introduction-content"
                    id="introduction"
                    >
                        <Typography sx={{fontWeight:'bold', fontSize:'1.2rem', color:'#99542C'}}>Site Introduction</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {clickedData.description}
                        </Typography>
                        
                        {/* // Add a divider */}
                        <Divider sx={{margin:'10px 0'}} />

                        <Typography sx={{fontSize:'.85rem', marginTop:'10px'}}>
                            <span className='contact-list-title'>Phone:</span> {phoneNumFormat(clickedData)}
                        </Typography>
                        <Typography sx={{fontSize:'.85rem', marginTop:'2px'}}>
                        <span className='contact-list-title'>Email:</span> {clickedData.contacts.emailAddresses[0].emailAddress}
                        </Typography>
                        <Typography sx={{fontSize:'.85rem', marginTop:'2px'}}>
                        <span className='contact-list-title'>Address:</span> {clickedData.addresses[0].line1 + ', ' + clickedData.addresses[0].city + ', ' + clickedData.addresses[0].stateCode + ', ' + clickedData.addresses[0].postalCode}
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{marginTop:'10px'}} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography sx={{fontWeight:'bold', fontSize:'1.2rem', color:'#99542C'}}>Featured Topics</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {(()=>{
                            // If no topics data then return chip showing 'info not found'
                            if(topics.length===0){
                                return (<Chip sx={{margin:'2px'}} key='topic-not-found' label={'Info not found'} size="small" variant="outlined" />)
                            }

                            return topics.map((d,index)=>{
                                return (<Chip sx={{margin:'2px'}} key={d+'-'+index} label={d} size="small" variant="outlined" />);
                            });
                            

                        })()}
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{marginTop:'10px'}} expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography sx={{fontWeight:'bold', fontSize:'1.2rem', color:'#99542C'}}>Featured Activities</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {(()=>{
                            // If no activities data then return chip showing 'info not found'
                            if(todos.length===0){
                                return (<Chip sx={{margin:'2px'}} key='activity-not-found' label={'Info not found'} size="small" variant="outlined" />)
                            }

                            return todos.map((d,index)=>{
                                return (<Chip sx={{margin:'2px'}} key={d+'-'+index} label={d} size="small" variant="outlined" />);
                            });
                            

                        })()}
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{marginTop:'10px'}} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{margin:'0px'}}
                    >
                        <Typography sx={{fontWeight:'bold', fontSize:'1.2rem', color:'#99542C'}}>Open Time</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        { (()=>{
                            // Use an immediate Invoked Function to return ops hr chips
                            let data = null;
                            // Initiate an array as a temporary array used to sort the operations hour based on weekday order
                            let hrsChip = [];
                            // Initiate an array to be return as the final data of the operations hour
                            let finalhrsArr = [];

                            // If no operation hours, then return chip showing info of 'not found'
                            if(clickedData.operatingHours.length===0){
                                hrsChip.push(<Chip sx={{margin:'4px'}} key={'na'} label={'Info not found'} size="small" variant="outlined" />)
                                return hrsChip;
                            }

                            // data = clickedData.operatingHours[0].standardHours;
                            data = clickedData.operatingHours;


                            for(let d of data){
                                // empty the temp arrary so each time a site's operation hours from Monday to Friday can be reorder again.
                                hrsChip = [...[]];

                                finalhrsArr.push([
                                    <Typography sx={{fontWeight:'500', fontSize:'1rem', color:'#16411A', margin:'0 0 6px 6px'}}>{d.name}</Typography>,
                                    <Typography sx={{fontSize:'.8rem', color:'#99542C', margin:'0 0 10px 6px'}}>{d.description}</Typography>,
                                ]);

                                for(let weekday in d.standardHours){   
                                    d.standardHours[weekday].toLowerCase() === 'closed' || d.standardHours[weekday].toLowerCase() === 'close'?
                                    hrsChip.push(<Chip sx={{margin:'4px', background:'#EE4B2B', color:'white'}} key={weekday} label={weekday.charAt(0).toUpperCase()+weekday.slice(1,)+ ' : ' + d.standardHours[weekday]} size="small" />):
                                    hrsChip.push(<Chip sx={{margin:'4px', background:'#297A31', color:'white'}} key={weekday} label={weekday.charAt(0).toUpperCase()+weekday.slice(1,)+ ' : ' + d.standardHours[weekday]} size="small" />)
                                }

                                //  sort the ops hours based on weekday order
                                const map = {
                                    "monday": 1,
                                    "tuesday": 2,
                                    "wednesday": 3,
                                    "thursday": 4,
                                    "friday": 5,
                                    "saturday": 6,
                                    "sunday": 7
                                }

                                hrsChip.sort((a,b)=>{
                                    return map[a.key] - map[b.key]
                                })
                                
                                // Add a divider
                                hrsChip.push(<Divider sx={{margin:'10px 0'}} />);
                                
                                finalhrsArr.push(hrsChip);
                            }

                            return [...finalhrsArr]

                        })()
                        }
                        <p className='ops-hr-text'>* The agenda during holidays may be different. Make sure to check out <a className='infoWindow-link' target='_blank' href={clickedData.url}>the official website</a> for more info.</p>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{marginTop:'10px'}} expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography sx={{fontWeight:'bold', fontSize:'1.2rem', color:'#99542C'}}>Directions Info</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {clickedData.directionsInfo}
                        </Typography>
                        <Typography sx={{fontWeight:'bold' ,fontStyle:'italic', margin:'15px 0 0'}}>
                            * For more information, please visit <a className='infoWindow-link' target='_blank' href={clickedData.directionsUrl}>here</a> to learn more.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{marginTop:'10px'}} expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography sx={{fontWeight:'bold', fontSize:'1.2rem', color:'#99542C'}}>Weather Info</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {clickedData.weatherInfo}
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                </DialogContent>
            </Dialog>
        );
    }
}