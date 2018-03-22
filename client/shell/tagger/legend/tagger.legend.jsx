import React from 'react';
import dondeTaggerAPI from 'services/dondetagger.js';
import Sidepanel from 'controls/sidepanel/ui.sidepanel.jsx';
import ImageZoom from 'controls/imagezoom';

class Legend extends React.Component {
    constructor(props) {
        super(props);
        this.onShowTagLegend = this.onShowTagLegend.bind(this);
        this.onHideTagLegend = this.onHideTagLegend.bind(this);
        this.state = {
            images: [],
            title: null
        }
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
            images: event.images,
            title: event.title
        });
        this.refSidepanel.show();
    }

    onHideClick() {
        dondeTaggerAPI.hideTagLegend();
    }

    onHideTagLegend() {
        this.refSidepanel.hide();
    }

    viewTag() {
        this.refSidepanel
    }

    render() {
        return (
            <Sidepanel id="tagger-legend" style={{ openright: true }} ref={(thisSidepanel) => (this.refSidepanel = thisSidepanel)}>
                <h1>
                    <button onClick={this.onHideClick} className="font-icons icon-normal-hide"></button>
                    <div className="title">{this.state.title}</div>
                </h1>
                <ul>{this.state.images.map((imageUrl) => (
                    <li key={imageUrl}>
                        <ImageZoom
                            src={imageUrl}
                            scale={0.5}
                            onReset={dondeTaggerAPI.imagePanStop}
                            canvas={document.querySelector('#view-item > .main > .image > canvas')} />
                    </li>)
                )}
                </ul>
            </Sidepanel>
        );
    }
}

export default Legend