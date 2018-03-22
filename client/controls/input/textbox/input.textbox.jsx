import React from 'react';
import { classList } from 'controls/modules.v2.jsx';
import './input.textbox.scss';

class InputTextbox extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.focus = this.focus.bind(this);
        this.renderPlaceholder = this.renderPlaceholder.bind(this);
        this.onPlaceholderClick = this.onPlaceholderClick.bind(this);
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

    onPlaceholderClick() {
        if (this.input.value !== '') {
            this.input.value = '';
            this.onChange();
        }
        this.focus();
    }

    focus() {
        this.input.focus();
    }

    renderPlaceholder() {
        if (this.props.placeholder)
            return this.props.placeholder;
        return <div className={'ui-input-icon ' + this.props.icon}></div>
    }
    render() {
        var className = classList('ui-input ui-input-textbox', null, this.props.className);
        var placeholder = this.renderPlaceholder();
        return (
            <div className={className}>
                <input className="ui-input-model" ref={(thisInput) => (this.input = thisInput)} type="text" onChange={this.onChange} />
                <button className="ui-input-placeholder" onClick={this.onPlaceholderClick}>{placeholder}</button>
            </div>
        )
    }
}

export default InputTextbox;