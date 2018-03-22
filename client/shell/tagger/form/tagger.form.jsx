import React from 'react';
import dondeTaggerAPI from 'services/dondetagger.js';
import { classList } from 'controls/modules.jsx';

import CircularProgressbar from 'react-circular-progressbar';

class TaggerFormItem extends React.Component {
    constructor(props) {
        super(props);
        this.onHelpClick = this.onHelpClick.bind(this);
        this.onShowTagLegend = this.onShowTagLegend.bind(this);
        this.onHideTagLegend = this.onHideTagLegend.bind(this);
        this.refInput = this.refInput.bind(this);
        this.reset = this.reset.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            highlighted: false,
            showScore: false
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    componentDidMount() {
        dondeTaggerAPI.bind('showtaglegend', this.onShowTagLegend);
        dondeTaggerAPI.bind('hidetaglegend', this.onHideTagLegend);
    }

    componentWillUnmount() {
        dondeTaggerAPI.unbind('showtaglegend', this.onShowTagLegend);
        dondeTaggerAPI.unbind('hidetaglegend', this.onHideTagLegend);
    }

    onShowTagLegend(event) {
        this.setState({
            highlighted: (event.title === this.props.label)
        });
    }

    reset() {
        this.domInput.checked = false;
    }

    onHideTagLegend() {
        this.setState({
            highlighted: false
        });
    }

    onHelpClick() {
        dondeTaggerAPI.bind('showtaglegend', this.onShowTagLegend);
        dondeTaggerAPI.showTagLegend(this.props.category, this.props.tag);
    }

    onChange() {
        this.props.onChange(this.domInput.value);
    }

    refInput(element) {
        // console.log(this.props.checked);
        this.domInput = element;
        // element.checked = this.props.checked;
    }

    render() {
        var className = classList(null, {
            'active': this.state.highlighted,
            'checked': this.props.checked
        });

        return (
            <li className={className}>
                <label>
                    <input ref={this.refInput} checked={this.props.checked} onChange={this.onChange} type="radio" name={this.props.name} value={this.props.value} />
                    <div className='content'>
                        <div className='label'>{this.props.label}</div>
                        {(this.state.showScore) ? (
                            <div className='score'>
                                <div className='score-graph'>
                                    <CircularProgressbar strokeWidth={19} percentage={this.props.score.value} textForPercentage={() => ''}></CircularProgressbar>
                                </div>
                                <div className='score-details'>
                                    <div className='score-manual'>{this.props.score.manual}</div>
                                    <div className='score-value'>{(this.props.score.value) ? this.props.score.value.toFixed(1) + '%' : ''}</div>
                                </div>
                            </div>) : <div className='score' />}

                        <button type="button" onClick={this.onHelpClick} className="font-icons icon-normal-help"></button>
                    </div>
                </label>
            </li>)
    }
}

class TaggerFormCategory extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onReset = this.onReset.bind(this);
        this.refItems = {};

        var manualTags = this.props.tags.filter((tag) => ((tag.score.manual)));
        manualTags.sort((tagA, tagB) => (tagB.score.value - tagA.score.value));

        this.state = {
            valid: manualTags.length,
            value: (manualTags.length) ? manualTags[0].name : null,
        }
    }

    componentDidMount() {

        // dondeTaggerAPI.bind('itemchange', this.onItemChange);
        // dondeTaggerAPI.bind('beforeitemtagging', this.onBeforeItemTagging);
    }

    onChange(value) {
        this.setState({
            valid: true,
            value: value
        });
        this.props.onChange();
    }

    onReset() {
        this.refItems[this.state.value].reset();
        this.setState({
            valid: false,
            value: null
        });
        this.props.onChange();
    }

    render() {
        this.refItems = {};
        var className = classList(null, {
            'valid': (this.state.valid)
        });
        return (
            <li className={className}>
                <div className="category">
                    <label><font color={(this.props.status == 'error') ? 'red' : null}>{this.props.name}</font></label>
                    <button className="font-icons icon-normal-reset" type="button" onClick={this.onReset}></button>
                </div>
                <ul className="values">{this.props.tags.map((tag, key) => (
                    <TaggerFormItem ref={(thisItem) => { this.refItems[tag.name] = thisItem }} key={key}
                        name={this.props.name}
                        value={tag.name}
                        checked={this.state.value === tag.name}
                        category={this.props.name}
                        tag={tag.name}
                        label={tag.name}
                        score={tag.score}
                        examples={tag.examples}
                        onChange={this.onChange} />))}
                </ul>
            </li>)
    }
}

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.onItemChange = this.onItemChange.bind(this);
        this.onTagItem = this.onTagItem.bind(this);
        this.onBeforeItemTagging = this.onBeforeItemTagging.bind(this);
        this.onChange = this.onChange.bind(this);
        this.value = this.value.bind(this);

        this.state = {
            itemId: null,
            categories: [],
            enabled: false,
            valid: false,
            status: {
                total: 0,
                tagged: 0
            },
            status_all: []
        }
    }

    componentDidMount() {
        dondeTaggerAPI.bind('itemchange', this.onItemChange);
        dondeTaggerAPI.bind('beforeitemtagging', this.onBeforeItemTagging);


    }

    componentWillUnmount() {
        dondeTaggerAPI.unbind('itemchange', this.onItemChange);
        dondeTaggerAPI.unbind('beforeitemtagging', this.onBeforeItemTagging);
    }

    onBeforeItemTagging() {
        this.setState({
            item: null,
            categories: [],
            enabled: false,
            valid: false
        })
    }

    onItemChange(event) {
        var categories = event.tags;
        var manualCategories = categories.filter((category) => (category.tags.filter((tag) => (tag.score.manual)).length));
        this.setState({
            itemId: event.item._id,
            categories: categories,
            enabled: true,
            valid: manualCategories.length > 0,
            status: {
                total: event.status.num_of_items,
                tagged: event.status.num_of_tagged_items
            },
            status_all: event.status_all.map((st) => ({ name: st.analyst_name, tagged: st.num_of_tagged_items, total: st.num_of_items }))
        });
    }

    value() {
        var formData = new FormData(this.refForm);
        //Extract only tags that were selected
        var tags = this.state.categories.map((category) => (category.tags.filter((tag) => (tag.name == formData.get(category.name)))))
        // merge arrays of categories
        tags = [].concat.apply([], tags);
        return tags;
    }

    onChange() {
        var tags = this.value();
        this.setState({
            valid: (tags.length > 0)
        })
    }

    onTagItem() {
        var tags = this.value();
        dondeTaggerAPI.tagItem(this.state.itemId, tags);
    }

    render() {
        var buttonLabel = (this.state.valid) ? 'Tag Item' : 'Skip Item';
        return (
            <div id="tagger-form">
                <form ref={(thisForm => (this.refForm = thisForm))}>
                    <ul className="categories">{this.state.categories.map((category, key) => (
                        <TaggerFormCategory onChange={this.onChange} key={key}
                            name={category.name}
                            tags={category.tags} status={category.status} />))}
                    </ul>
                </form>
                <button className="submit" onClick={this.onTagItem} disabled={!this.state.enabled}>{buttonLabel}</button>
                <div className="status">
                    <label>
                        <span>My status: </span><span>{this.state.status.tagged}</span><span className="slash">/</span><span>{this.state.status.total}</span>
                    </label>
                </div>
                <div className="status">
                    <ul>{this.state.status_all.map((a) => (
                        //<ul>{[{ 'analyst_name': 'shai', 'num_of_tagged_items': 1, 'total': 2 }, { 'analyst_name': 'shai', 'num_of_tagged_items': 1, 'total': 2 }].map((a) => (
                        <li>
                            <label>
                                <span>{a.name}: </span><span>{a.tagged}</span><span className="slash">/</span><span>{a.total}</span>
                            </label>
                        </li>))}
                    </ul>
                </div>
            </div>);
    }
}

export default Form;