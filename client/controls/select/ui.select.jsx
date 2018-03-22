import React from 'react';
import { List, ListItemToggle } from 'controls/modules.jsx';
import { classList } from 'controls/modules.v2.jsx';

import './ui.select.scss';

export class SelectInputItem extends ListItemToggle {
}

class Select extends React.Component {
    constructor(props) {
        super(props);
        this.onOutputClick = this.onOutputClick.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.renderInputItem = this.renderInputItem.bind(this);
        this.renderInputItemLabel = this.renderInputItemLabel.bind(this);
        this.renderOutputItem = this.renderOutputItem.bind(this);
        this.renderOutputItemLabel = this.renderOutputItemLabel.bind(this);
        this.state = {
            input: (this.props.list) ? this.props.list : [],
            open: false,
            output: []
        };
    }
    onSelect(item, selected) {
        if (selected) {
            this.outputList.addItem(item);
        } else {
            this.outputList.removeItem(item);
        }
    }
    onOutputClick() {
        this.state.open = !this.state.open;
        if (this.state.open) {
            this.dom.classList.add('ui-select-open');
        } else {
            this.dom.classList.remove('ui-select-open');
        }
    }
    componentDidMount() {
        this.output.addEventListener("click", this.onOutputClick);
    }
    renderOutputItemLabel(item) {
        return item;
    }
    renderOutputItem(item, key) {
        return <li key={key}>
            {this.renderOutputItemLabel(item)}
        </li>
    }
    indexItem(item) {
        return item;
    }
    renderInputItemLabel(item) {
        return item;
    }
    renderInputItem(item, key) {
        return <SelectInputItem key={key} onSelect={this.onSelect} className='item' renderItemLabel={this.renderInputItemLabel} />
    }
    renderOutput(items) {
        return <ul>
            {items}
        </ul>
    }
    value() {
        return (this.state.output);
    }
    render() {
        var dropup = (this.props.style) ? this.props.style.dropup : false;

        var className = classList('ui-select', {
            'dropup': dropup,
            'dropdown': !dropup,
            'open': this.state.open
        }, this.props.className);
        var items = this.state.input.map(this.renderInputItem);
        var outputItems = this.renderOutput(items)
        return (
            <div ref={(dom) => (this.dom = dom)} className={className}>
                <div className='output' ref={(output) => (this.output = output)}>
                    <label>{this.props.label}</label>
                    <List ref={(outputList) => (this.outputList = outputList)} renderItem={this.renderOutputItem} list={this.state.output}></List>
                </div>
                <div className='input'>{outputItems}</div>
            </div>
        )
    }
}

export default Select