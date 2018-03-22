import React from 'react';
import './ui.tabs.scss';


class TabsLabel extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.state = {
            active: this.props.active
        }
    }
    onClick() {
        this.props.onclick(this.props.id);
    }
    render() {
        var className = 'ui-tabs-label';
        if (this.props.active) {
            className += ' active';
        }
        return <button className={className} onClick={this.onClick}>{this.props.children}</button>
    }
}

class TabsPanel extends React.Component {
    render() {
        var className = 'ui-tabs-panel';
        if (this.props.active) {
            className += ' active';
        }
        return <div className={className}>{this.props.children}</div>
    }
}

class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.renderLabel = this.renderLabel.bind(this);
        this.renderPanel = this.renderPanel.bind(this);
        this.setActive = this.setActive.bind(this);
        this.state = {
            active: 0
        }
    }
    setActive(key) {
        this.setState({
            active: key
        })
    }
    renderLabel(item, key) {
        var active = (key === this.state.active);
        return (
            <TabsLabel id={key} key={key} item={item} active={active} onclick={this.setActive}>{item.label}</TabsLabel>)
    }
    renderPanel(item, key) {
        var active = (key === this.state.active);
        return <TabsPanel id={key} key={key} active={active}>{item.panel}</TabsPanel>
    }
    render() {
        var labels = this.props.tabs.map(this.renderLabel);
        var panels = this.props.tabs.map(this.renderPanel);
        return (
            <div className='ui-tabs'>
                <div className='ui-tabs-labels'>{labels}</div>
                <div className='ui-tabs-panels'>{panels}</div>
            </div>
        );
    }
};

export default Tabs;