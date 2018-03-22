import React from 'react';
import dondeTaggerAPI from 'services/dondetagger.js';

import { classList } from 'controls/modules.jsx';

class ItemGalleryImage extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onImageLoad = this.onImageLoad.bind(this);
        this.onHover = this.onHover.bind(this);
        this.updateViewport = this.updateViewport.bind(this);

        this.state = {
            active: this.props.index === 0,
            viewport: {
                width: 0.5,
                height: 0.5,
                ratio: 0.5
            },
            scale: 0.5
        }
    }

    componentDidMount() {
        this.outputViewport = document.querySelector('#view-item > .main > .image');
        this.domImage.addEventListener('load', this.onImageLoad, false);
        this.domRoot.addEventListener('mousemove', this.onHover, false);
        this.domRoot.addEventListener('mousedown', this.onHover, false);
        this.domRoot.addEventListener('mouseleave', this.onMouseLeave, false);
    }

    updateViewport(x, y) {
        var imageWidth = this.domImage.offsetWidth;
        var imageHeight = this.domImage.offsetHeight;

        var viewportWidth = this.outputViewport.offsetWidth;
        var viewportHeight = this.outputViewport.offsetHeight;

        var viewportRatio = viewportHeight / viewportWidth;

        var width = imageWidth * this.state.scale;
        var height = width * viewportRatio;

        var imageScale = this.domImage.naturalWidth / imageWidth;

        var top = y - height / 2;
        var left = x - width / 2;

        if (top < 0) top = 0
        if (top + height > imageHeight) top = imageHeight - height + 1;
        if (left < 0) left = 0
        if (left + width > imageWidth) left = imageWidth - width;

        this.domViewport.style.top = top + 'px';
        this.domViewport.style.left = left + 'px';
        this.domViewport.style.width = width + 'px';
        this.domViewport.style.height = height + 'px';

        dondeTaggerAPI.imagePan(
            this.domImage,
            left * imageScale,
            top * imageScale,
            width * imageScale,
            height * imageScale);
    }

    onHover(event) {
        var x = event.offsetX;
        var y = event.offsetY;
        this.updateViewport(x, y);
    }

    onMouseLeave() {
        dondeTaggerAPI.imagePanStop();
    }

    onImageLoad() {
        this.setState({
            viewport: {
                width: this.outputViewport.offsetWidth,
                height: this.outputViewport.offsetHeight,
                ratio: this.outputViewport.offsetHeight / this.outputViewport.offsetWidth
            }
        })
    }

    onClick() {
        this.props.onClick(this.props.index);
    }

    render() {
        var className = classList(null, {
            'active': this.state.active
        });
        return (
            <li ref={(element) => (this.domRoot = element)} className={className} onClick={this.onClick}>
                <img ref={(element) => (this.domImage = element)} src={this.props.src}></img>
                <div ref={(element) => (this.domViewport = element)} className='viewport'></div>
            </li>)
    }
}

class ItemGallery extends React.Component {
    constructor(props) {
        super(props);
        this.activeImageIndex = 0;
        this.onImageSelect = this.onImageSelect.bind(this);
    }

    onImageSelect(index) {
        this.images[this.activeImageIndex].setState({ active: false });
        this.images[index].setState({ active: true });
        this.activeImageIndex = index;
        this.props.onSelect(index);
    }

    render() {
        this.images = {};
        this.activeImageIndex = 0;
        var items = this.props.images.map((item, key) => {
            return <ItemGalleryImage ref={(thisImage) => { this.images[key] = thisImage }} key={key} src={item} index={key} onClick={this.onImageSelect} />
        });
        return (
            <div className="gallery">
                <ul>{items}</ul>
            </div>
        )
    }
}

class ItemImage extends React.Component {
    constructor(props) {
        super(props);
        this.onImagePan = this.onImagePan.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onImagePanStop = this.onImagePanStop.bind(this);

        this.state = {
            index: 0
        }
    }

    componentDidUpdate() {
        this.onImagePanStop();
    }

    componentDidMount() {
        dondeTaggerAPI.bind('imagepan', this.onImagePan);
        dondeTaggerAPI.bind('imagepanstop', this.onImagePanStop);
        window.addEventListener('resize', this.onResize);
        this.ctx = this.domCanvas.getContext('2d');
        this.onResize();
        this.onImagePanStop();
    }

    onResize() {
        var domCanvas = this.domCanvas;
        domCanvas.width = domCanvas.offsetWidth * window.devicePixelRatio;
        domCanvas.height = domCanvas.offsetHeight * window.devicePixelRatio;
    }

    onImagePan(event) {
        var image = event.image;
        var viewport = event.viewport;
        this.ctx.drawImage(image, viewport.sx, viewport.sy, viewport.sw, viewport.sh, 0, 0, this.domCanvas.width, this.domCanvas.height);
    }

    onImagePanStop() {
        var image = new Image();
        var src = this.props.images[this.state.index];
        if (!src) return;
        image.src = this.props.images[this.state.index];
        this.ctx.clearRect(0, 0, this.domCanvas.width, this.domCanvas.height);

        image.onload = () => {
            this.onResize();
            var canvasWidth = this.domCanvas.width;
            var canvasHeight = this.domCanvas.height;
            var imageWidth = image.naturalWidth;
            var imageHeight = image.naturalHeight;
            var canvasRatio = canvasHeight / canvasWidth;
            var imageRatio = imageHeight / imageWidth;
            var canvasImageWidth = imageWidth;
            var canvasImageHeight = imageHeight;

            if (canvasRatio > imageRatio) {
                canvasImageWidth = canvasWidth;
                canvasImageHeight = canvasImageWidth * imageRatio;
            } else {
                canvasImageHeight = canvasHeight;
                canvasImageWidth = canvasImageHeight / imageRatio;
            }

            var left = (canvasWidth - canvasImageWidth) / 2;
            this.ctx.drawImage(image, 0, 0, imageWidth, imageHeight, left, 0, canvasImageWidth, canvasImageHeight);
        }

    }

    render() {
        return (
            <div ref={(element) => (this.domImage = element)} className="image">
                <canvas ref={(element) => (this.domCanvas = element)}></canvas>
            </div>
        )
    }
}

class Item extends React.Component {
    constructor(props) {
        super(props);
        this.onItemChange = this.onItemChange.bind(this);
        this.onImageSelect = this.onImageSelect.bind(this);
        this.state = {
            item: null
        };
        dondeTaggerAPI.getItem();
    }

    componentDidMount() {
        dondeTaggerAPI.bind('itemchange', this.onItemChange);
    }

    componentWillUnmount() {
        dondeTaggerAPI.unbind('itemchange', this.onItemChange);
    }

    onImageSelect(index) {
        this.image.setState({
            index: index
        });
    }

    onItemChange(event) {
        this.gallery.activeImageIndex = 0;
        this.setState({
            item: event.item
        });
        this.image.setState({
            index: 0
        });
    }
    render() {
        var item = this.state.item;
        var images = [];
        var title = null;
        var description = null;
        if (item) {
            var title = item.title;
            var description = item.description;
            var pic = item.pic;
            var images = item.images;
        }
        return (
            <div id="view-item">
                <ItemGallery ref={(thisGallery) => { this.gallery = thisGallery }} images={images} onSelect={this.onImageSelect}></ItemGallery>
                <div className="main">
                    <ItemImage ref={(thisImage) => { this.image = thisImage }} images={images}></ItemImage>
                    <div className="description">
                        <h1>{title}</h1>
                        <p dangerouslySetInnerHTML={{ __html: description }}></p>
                    </div>
                </div>
            </div>)
    }
}

export default Item