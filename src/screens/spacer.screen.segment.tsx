import React, { Component } from "react";
import { Divider } from 'react-native-elements';

export class SpacerScreenSegment extends Component { 
    render() {
        return (<Divider style={{ backgroundColor: 'blue' }} />);
    }
}