import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './Map';
import Filter from './Filter';
import Display from './Display';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@mui/styles';

import { AppBar, Card, Drawer, Fab, IconButton, makeStyles, Paper, SwipeableDrawer, Toolbar, Typography, withStyles } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

class App extends Component {
  state = {
    activityType: "All",
    minDistance: 0,
    startYear: 2000,
    endYear: 2030,
    threeD: false,
    satellite: false,
    sidebarOpen: false
  }

  
  updateFilters(activityType: string, minDistance: Number, startYear: Number, endYear: Number) {
    console.log("Min Distance: " + minDistance)
    this.setState({ activityType: activityType, minDistance: minDistance, startYear: startYear, endYear: endYear })
  }

  updateDisplay(threeD: boolean, satellite: boolean) {
    console.log("Display updated: 3D: " + threeD + ", satellite: " + satellite)
    this.setState({ threeD: threeD, satellite: satellite })
  }

  toggleSidebar() {
    this.setState({
      sidebarOpen: !this.state.sidebarOpen
    })
  }

  hideSidebar() {
    this.setState({
      sidebarOpen: false
    })
  }

  render() {
    return (
      <ThemeProvider theme={theme} >
        <CssBaseline />
        <Box className="App">
          <AppBar position="absolute" sx={{
            zIndex: 100000
          }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.toggleSidebar.bind(this)} >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">
                Straved
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer variant="persistent" open={this.state.sidebarOpen} onClose={this.hideSidebar.bind(this)} >
            {/* pad down below the title bar */}
            <div style={{
              paddingTop: "64px",
              width: "200px"
            }} />
            <Card variant='outlined'>
              <Typography variant="h6" align='center'>Filters</Typography>
              <Filter updateFilters={this.updateFilters.bind(this)} />
            </Card>
            <Card variant='outlined'>
              <Typography variant="h6" align='center'>Display</Typography>
              <Display updateDisplay={this.updateDisplay.bind(this)} />
            </Card>
          </Drawer>
          <Map activityType={this.state.activityType}
            minDistance={this.state.minDistance}
            startYear={this.state.startYear}
            endYear={this.state.endYear}
            satellite={this.state.satellite}
            threeD={this.state.threeD}
          />

        </Box>
      </ThemeProvider>

    );
  }
}

export default App;
