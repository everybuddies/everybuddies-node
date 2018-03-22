import React from 'react';
import { classList } from 'controls/modules.v2.jsx';
import './input.numberbox.scss';

class InputNumberbox extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.focus = this.focus.bind(this);
        this.state = {
            value: (this.props.value) ? this.props.value : ''
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        this.input.addEventListener("keyup", this.onChange, false);
        this.input.addEventListener("change", this.onChange, false);
    }

    componentWillUnmount() {
        this.input.removeEventListener("keyup", this.onChange, false);
        this.input.removeEventListener("change", this.onChange, false);
    }

    onChange() {
        this.props.onChange(this.input.value);
    }

    focus() {
        this.input.focus();
    }

    render() {
        var className = classList('ui-input ui-input-textbox', null, this.props.className);
        return (
            <div className={className}>
                <input className="ui-input-model" type="number" min={this.props.min} max={this.props.max} ref={(thisInput) => (this.input = thisInput)} onChange={this.onChange} />
            </div>
        )
    }
}
//dondejerry-icons icon-normal-check
//dondejerry-font icon-24-check
export default InputNumberbox;