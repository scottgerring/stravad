import React from 'react';
import { Component } from 'react';
import Select from '@mui/material/Select';
import { FormControl, List, ListItem, MenuItem } from '@mui/material';

interface IProps {
    updateDisplay(threeD: boolean, satellite: boolean) : void
}

class Display extends Component<IProps> {

    state = {
        threeD: false,
        satellite: false
    };

    notifyChange() {
        this.props.updateDisplay(this.state.threeD, this.state.satellite)
    }

    handle3DChanged(event: any) {
        this.setState({threeD: event.target.value === 'true'}, this.notifyChange)
    }

    handleSatelliteChanged(event: any) {
        this.setState({satellite: event.target.value === 'true'}, this.notifyChange)
    }
    
    render() {
        return (
            <List>
                <ListItem>
                    <FormControl className="formControl">
                        <Select value={this.state.threeD.toString()} onChange={this.handle3DChanged.bind(this)}>
                            <MenuItem value="true">3D</MenuItem>
                            <MenuItem value="false">2D</MenuItem>
                        </Select>   
                    </FormControl>
                </ListItem>
                <ListItem>
                    <FormControl className="formControl">
                        <Select value={this.state.satellite.toString()} onChange={this.handleSatelliteChanged.bind(this)}>
                            <MenuItem value="true">Satellite</MenuItem>
                            <MenuItem value="false">Topo</MenuItem>
                        </Select>     
                    </FormControl>
                </ListItem>
            </List>
        );
    }
}

export default Display