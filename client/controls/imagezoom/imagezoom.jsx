import React from 'react';
import './imagezoom.scss';

function updateViewport({ x, y }, scale,
    { offsetWidth: imageWidth, offsetHeight: imageHeight, naturalWidth: imageNaturalWidth },
    { width: viewportWidth, height: viewportHeight },
    viewport) {

    var viewportRatio = viewportHeight / viewportWidth;

    var width = imageWidth * scale;
    var height = width * viewportRatio;

    var imageScale = imageNaturalWidth / imageWidth;

    var top = y - height / 2;
    var left = x - width / 2;

    if (top < 0)
        top = 0
    if (top + height > imageHeight)
        top = imageHeight - height + 1;
    if (left < 0)
        left = 0
    if (left + width > imageWidth)
        left = imageWidth - width;

    viewport.style.top = top + 'px';
    viewport.style.left = left + 'px';
    viewport.style.width = width + 'px';
    viewport.style.height = height + 'px';

    return {
        sx: left * imageScale,
        sy: top * imageScale,
        sw: width * imageScale,
        sh: height * imageScale
    }
}

export default class ImageZoom extends React.Component {
    constructor(props) {
        super(props);
        this.onReset = this.onReset.bind(this);
        this.onPan = this.onPan.bind(this);
    }

    componentDidMount() {
        this.ctx = this.props.canvas.getContext('2d');
        this.domImage.addEventListener('load', this.onImageLoad, false);
        this.domRoot.addEventListener('mousemove', this.onPan, false);
        this.domRoot.addEventListener('mousedown', this.onPan, false);
        this.domRoot.addEventListener('mouseleave', this.onReset, false);
    }

    componentWillUnmount() {
        this.domImage.removeEventListener('load', this.onImageLoad, false);
        this.domRoot.removeEventListener('mousemove', this.onPan, false);
        this.domRoot.removeEventListener('mousedown', this.onPan, false);
        this.domRoot.removeEventListener('mouseleave', this.onReset, false);
    }

    onPan({ offsetX: x, offsetY: y }) {
        var { sx, sy, sw, sh } =
            updateViewport({ x, y }, this.props.scale, this.domImage, this.props.canvas, this.domViewport);
        this.ctx.drawImage(this.domImage, sx, sy, sw, sh, 0, 0, this.props.canvas.width, this.props.canvas.height);
    }

    onReset() {
        this.ctx.clearRect(0, 0, this.props.canvas.width, this.props.canvas.height);

        this.props.onReset();
    }

    onImageLoad() {
        // this.setState({
        //     viewport: {
        //         width: this.props.canvas.offsetWidth,
        //         height: this.props.canvas.offsetHeight,
        //         ratio: this.props.canvas.offsetHeight / this.outputViewport.offsetWidth
        //     }
        // })
    }

    render() {
        return (
            <div ref={(element) => (this.domRoot = element)} className="ui-imagezoom">
                <img ref={(element) => (this.domImage = element)} src={this.props.src} />
                <div ref={(element) => (this.domViewport = element)} className="ui-imagezoom-viewport"></div>
            </div>)
    }
}