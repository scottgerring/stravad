import React from 'react';
import { Component } from 'react';
import Select from '@mui/material/Select';
import { FormControl, FormControlLabel, InputLabel, List, ListItem, MenuItem, Typography } from '@mui/material';

interface IProps {
    updateFilters(type: String, minDistanceMeters: Number, startYear: Number, endYear: Number) : void
}

class Filter extends Component<IProps> {

    state = {
        activityType: "All",
        minDistance: 0,
        startYear: 2008,
        endYear: 2023
    };

    notifyChange() {
        this.props.updateFilters(this.state.activityType, 
            this.state.minDistance, 
            this.state.startYear, 
            this.state.endYear)
    }

    handleChange(event: any) {
        this.setState({activityType: event.target.value}, this.notifyChange)        
    }

    handleDistanceChange(event: any) {
        this.setState({minDistance: parseInt(event.target.value)}, this.notifyChange)
    }

    handleStartYearChanged(event: any) {
        this.setState({startYear: parseInt(event.target.value)}, this.notifyChange)
    }

    handleEndYearChanged(event: any) {
        this.setState({endYear: parseInt(event.target.value)}, this.notifyChange)
    }

    offsetYear(offset: number) {
        const startYear = this.state.startYear;
        const endYear = this.state.endYear;        
        this.setState({
            endYear: endYear + offset,
            startYear: startYear + offset
        })
        this.notifyChange()
    }
    

    render() {
        console.log("RENDER ACTIVITY TYPE: " + this.state.activityType)
        const formControl = {
            width: "150px",
            paddingTop: "10px"
        }

        return (
            <List>
                <ListItem>
                    <FormControl sx={formControl}>
                        <InputLabel id="select-activity-label">Activity</InputLabel>
                        <Select labelId="select-activity-label" value={this.state.activityType} onChange={this.handleChange.bind(this)} native={false}>
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Ride">Bike</MenuItem>
                            <MenuItem value="Hike">Hike</MenuItem>
                            <MenuItem value="Walk">Walk</MenuItem>
                            <MenuItem value="Run">Run</MenuItem>
                            <MenuItem value="AlpineSki">Alpine Ski</MenuItem>
                            <MenuItem value="NordicSki">Nordic Ski</MenuItem>
                            <MenuItem value="BackcountrySki">Backcountry Ski</MenuItem>
                        </Select>  
                    </FormControl>
                </ListItem>
                    <ListItem>
                        <FormControl sx={formControl} >
                            <InputLabel id="min-distance-label">Minimum Distance</InputLabel>                        
                            <Select labelId="min-distance-label" value={this.state.minDistance} onChange={this.handleDistanceChange.bind(this)}>
                                <MenuItem value="0">0 km </MenuItem> 
                                <MenuItem value="5000">5 km </MenuItem> 
                                <MenuItem value="10000">10 km </MenuItem> 
                                <MenuItem value="15000">15 km </MenuItem> 
                                <MenuItem value="20000">20 km </MenuItem> 
                            </Select>
                        </FormControl>
                    </ListItem>              
                <ListItem>
                <FormControl sx={formControl} >
                        <InputLabel id="start-year-label">Year From</InputLabel>                        
                        {/* <button onClick={() => this.offsetYear.bind(this)(-1)}>&lt;</button>a */}
                        <Select value={this.state.startYear} onChange={this.handleStartYearChanged.bind(this)}>
                            <MenuItem value="2008">2008</MenuItem> 
                            <MenuItem value="2009">2009</MenuItem> 
                            <MenuItem value="2010">2010</MenuItem> 
                            <MenuItem value="2011">2011</MenuItem> 
                            <MenuItem value="2012">2012</MenuItem> 
                            <MenuItem value="2013">2013</MenuItem> 
                            <MenuItem value="2014">2014</MenuItem> 
                            <MenuItem value="2015">2015</MenuItem> 
                            <MenuItem value="2016">2016</MenuItem> 
                            <MenuItem value="2017">2017</MenuItem> 
                            <MenuItem value="2018">2018</MenuItem> 
                            <MenuItem value="2019">2019</MenuItem> 
                            <MenuItem value="2020">2020</MenuItem> 
                            <MenuItem value="2021">2021</MenuItem> 
                            <MenuItem value="2022">2022</MenuItem>
                            <MenuItem value="2023">2023</MenuItem> 
                            <MenuItem value="2024">2024</MenuItem>                             
                        </Select> 
                    </FormControl>
                </ListItem>
                <ListItem>
                <FormControl sx={formControl} >
                        <InputLabel id="end-year-label">Year To</InputLabel>                                 
                        <Select value={this.state.endYear} onChange={this.handleEndYearChanged.bind(this)}>
                            <MenuItem value="2008">2008</MenuItem> 
                            <MenuItem value="2009">2009</MenuItem> 
                            <MenuItem value="2010">2010</MenuItem> 
                            <MenuItem value="2011">2011</MenuItem> 
                            <MenuItem value="2012">2012</MenuItem> 
                            <MenuItem value="2013">2013</MenuItem> 
                            <MenuItem value="2014">2014</MenuItem> 
                            <MenuItem value="2015">2015</MenuItem> 
                            <MenuItem value="2016">2016</MenuItem> 
                            <MenuItem value="2017">2017</MenuItem> 
                            <MenuItem value="2018">2018</MenuItem> 
                            <MenuItem value="2019">2019</MenuItem> 
                            <MenuItem value="2020">2020</MenuItem> 
                            <MenuItem value="2021">2021</MenuItem> 
                            <MenuItem value="2022">2022</MenuItem>
                            <MenuItem value="2023">2023</MenuItem> 
                            <MenuItem value="2024">2024</MenuItem> 
                        </Select>   
                    </FormControl>                           
                    {/* <Button onClick={() => this.offsetYear.bind(this)(1)}>&gt;</Button> */}
                    </ListItem>
            </List>
        );
    }
}

export default Filter
