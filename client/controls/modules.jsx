import React from 'react';

export function parseSearchQuery(search) {
    if (!search) {
        return {};
    }
    return (/^[?#]/.test(search) ? search.slice(1) : search)
        .split('&')
        .reduce((params, param) => {
            let [key, value] = param.split('=');
            var decodeValue = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
            if (!params[key]) {
                params[key] = [];
            }
            params[key].push(decodeValue);
            return params;
        }, {});
};

export class EventTarget {
    constructor() {
        this.listeners = {};
        this.dispatchEvent = this.dispatchEvent.bind(this);
        this.addEventListener = this.addEventListener.bind(this);
        this.removeEventListener = this.removeEventListener.bind(this);
        this.createEvent = this.createEvent.bind(this);
    }

    createEvent(type, eventProps) {
        var event = new Event(type);
        for (var prop in eventProps) {
            event[prop] = eventProps[prop];
        }
        this.dispatchEvent(event);
    }

    dispatchEvent(event) {
        if (!(event.type in this.listeners)) {
            return;
        }
        var stack = this.listeners[event.type];
        for (var i = 0, l = stack.length; i < l; i++) {
            stack[i].call(this, event);
        }
    }

    addEventListener(type, callback) {
        if (!(type in this.listeners)) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
    }

    removeEventListener(type, callback) {
        if (!(type in this.listeners)) {
            return;
        }
        var stack = this.listeners[type];
        for (var i = 0, l = stack.length; i < l; i++) {
            if (stack[i] === callback) {
                stack.splice(i, 1);
                return this.removeEventListener(type, callback);
            }
        }
    }
}


export function classList(baseClassName, classStates, propsClassName) {
    var list = (baseClassName) ? baseClassName.split(' ') : [];
    if (propsClassName) {
        var propsList = propsClassName.split(' ');
        list = list.concat(propsList);
    }
    for (var className in classStates) {
        if (classStates[className]) {
            list.push(className);
        }
    }
    return list.join(' ');
};

export class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.state = {
            selected: this.props.getStateSelected(this.props.item)
        }
    }
    onClick() {
        this.props.onSelect(this.props.item);
    }
    render() {
        var className = classList(this.props.className, {
            'selected': this.state.selected
        });
        return <li className={className} onClick={this.onClick}>{this.props.children}</li>
    }
}

export class List extends React.Component {
    constructor(props) {
        super(props);
        this.getItemKey = this.getItemKey.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderItemLabel = this.renderItemLabel.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
        this.getItemStateSelected = this.getItemStateSelected.bind(this);
        this.domItems = {};
    }

    onItemSelect(item) {
        return item;
    }

    getItemKey(item, index) {
        return index;
    }

    renderItemLabel(item) {
        return item;
    }

    getItemStateSelected(item) {
        return (!item);
    }

    refItem(thisItem, key) {
        this.domItems[key] = thisItem;
    }

    renderItem(item, index) {
        var key = this.getItemKey(item, index);
        var itemLabel = this.renderItemLabel(item);
        return <ListItem key={key} item={item} getStateSelected={this.getItemStateSelected} onSelect={this.onItemSelect} ref={(thisItem) => (this.refItem(thisItem, key, item))}>{itemLabel}</ListItem>
    }

    render() {
        var className = classList(this.props.className);
        var items = (this.props.filter) ? this.props.items.filter(this.props.filter) : this.props.items;
        if (this.props.sort) {
            items.sort(this.props.sort);
        }
        var itemsRendered = items.map(this.renderItem);
        return (
            <ul className={className}>{itemsRendered}</ul>
        )
    }
}

