import React from 'react';
import { classList } from 'controls/modules.jsx';
import './ui.sidepanel.scss';

class Sidepanel extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            open: (this.props.isOpen) ? this.props.isOpen() : false
        }
    }

    show() {
        this.setState({
            open: true
        });
    }

    hide() {
        this.setState({
            open: false
        });
    }

    toggle() {
        this.setState({
            open: !this.state.open
        });
    }

    render() {
        var openright = (this.props.style) ? this.props.style.openright : false;
        var className = classList('ui-sidepanel', {
            'open': this.state.open,
            'openleft': (openright !== true),
            'openright': openright
        }, this.props.className);

        return (
            <div id={this.props.id} className={className}>
                <div className="ui-sidebar-body">
                    {this.props.children}
                </div>
            </div>
        )
    }
}
export default Sidepanel;