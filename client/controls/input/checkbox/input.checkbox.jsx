import React from 'react';
import './input.checkbox.scss';

class InputCheckbox extends React.Component {

    constructor(props) {
        super(props);
        this.focus = this.focus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            checked: (this.props.checked === true)
        }
    }

    componentDidMount() {
        this.input.addEventListener("change", this.onChange);
    }

    focus() {
        this.input.focus();
    }

    onChange() {
        this.props.onChange(this.input.checked);
    }

    render() {
        var className = 'ui-input ui-input-checkbox';
        if (this.props.className) {
            className += ' ' + this.props.className;
        }
        return (
            <div className={className}>
                <label>
                    <input ref={(thisInput) => (this.input = thisInput)} type="checkbox" onFocus={this.props.onFocus} onChange={this.onChange} value={this.props.value} checked={this.props.checked} />
                    <div className="ui-input-box"></div>
                </label>
            </div>
        )
    }
}
//dondejerry-icons icon-normal-check
//dondejerry-font icon-24-check
export default InputCheckbox;