import React, {Component} from 'react';
import EnhancedModal from 'modal-enhanced-react-native-web';

export interface Props {
    isVisible : boolean;
}

export interface State {
    isVisible : boolean;
}

export class Modal extends Component {

    state : State;

    constructor(props : Props) {
        super(props);

        this.state = {
            isVisible : props.isVisible
        }
    }

    render() {
        return (<EnhancedModal isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible : false })}>
            {this.props.children}
        </EnhancedModal>);
    }
}