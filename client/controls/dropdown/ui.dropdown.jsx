import React from 'react';
import { classList } from 'controls/modules.v2.jsx';
import './ui.dropdown.scss';

class Dropdown extends React.PureComponent {
    constructor(props) {
        super(props);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.renderButton = this.renderButton.bind(this);
        this.state = {
            open: false
        };
    }
    componentDidMount() {
        this.button.addEventListener("click", this.show, false);
        this.backdrop.addEventListener("click", this.hide, false);
    }
    componentWillUnmount() {
        this.button.removeEventListener("click", this.show, false);
        this.backdrop.removeEventListener("click", this.hide, false);
    }
    show() {
        this.setState({
            open: true
        });
        if (this.props.onShow) {
            this.props.onShow();
        }
    }
    hide() {
        this.setState({
            open: false
        });
        if (this.props.onHide) {
            this.props.onHide();
        }
    }
    renderPanel() {
        return "ui-dropdown";
    }
    renderButton() {
        return (<div className='ui-dropdown-content'>
            <button ref={(thisButton) => { this.button = thisButton }}>{this.props.label}</button>
        </div>)
    }
    render() {
        var dropup = (this.props.style) ? this.props.style.dropup : false;

        var className = classList('ui-dropdown', {
            'dropup': dropup,
            'dropdown': (dropup !== true),
            'open': this.state.open
        }, this.props.className);

        var button = this.renderButton()
        return (
            <div ref="dom" className={className}>
                {button}
                <div ref={(backdrop) => (this.backdrop = backdrop)} className="ui-dropdown-backdrop"></div>
                <div className='ui-dropdown-panel'>{this.props.children}</div>
            </div>
        );
    }
}

export default Dropdown;