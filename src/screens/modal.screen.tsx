import React, {Component} from 'react';
import EnhancedModal from 'modal-enhanced-react-native-web';

export interface Props {
    isVisible : boolean;
    onBackdropPresss: () => void;
}

export class Modal extends Component {

    render() {
        return (<EnhancedModal isVisible={this.props.isVisible} onBackdropPress={() => {
            this.props.onBackdropPress();
        }}>
            {this.props.children}
        </EnhancedModal>);
    }
}