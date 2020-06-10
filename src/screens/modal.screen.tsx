import React, {Component} from 'react';
import EnhancedModal from 'modal-enhanced-react-native-web';

export class Modal extends Component {

    constructor(props) {
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