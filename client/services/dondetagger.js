// var server = ENV.api.url; //'https://api.dev.dondesearch.com/v1/tagger';
// var apiKey = 'AIzaSyBpDYujyWpFMtizT8MCpzCpVKYFwPVN3hE';
// var server = 'http://localhost:8001'// 'http://api.dev.dondesearch.com';
//console.log(server);
import sessionService from 'services/session';
import eventTarget, { trigger } from './events';

class DondeTaggerAPI {

    constructor() {
        this.items = [];
        this.tags = null;
        this.legendTag = null;
        this.resolveJobId = null;
        this.promiseJobId = new Promise((resolve) => {
            this.resolveJobId = resolve;
        });

        this.promiseTags = new Promise((resolve, reject) => {
            this.promiseJobId.then(() => {
                sessionService.fetch({
                    url: 'jobs/' + this.jobId + '/tags',
                    method: 'get'
                }).then((response) => {
                    (response);
                    console.log(response.tags);
                    this.tags = Object.keys(response.tags).map((category) => ({
                        name: category,
                        tags: Object.keys(response.tags[category]).map((tag) => (response.tags[category][tag]))
                    }));
                    resolve(this.tags);
                });
            })
        });

        this.resolve = Promise.all([
            this.promiseJobId
        ]);
    }

    showTagLegend(category, tag) {
        if ((this.legendTag) &&
            (this.legendTag.category === category) &&
            (this.legendTag.tag === tag)) {
            this.hideTagLegend();
        } else {
            this.legendTag = {
                category: category,
                tag: tag
            };
            trigger.showTagLegend(this.tags, this.legendTag);
        }
    }

    hideTagLegend() {
        this.legendTag = null;
        trigger.hideTagLegend();
    }

    getItem() {
        trigger.beforeItemChange();
        if (!this.jobId) {
            return trigger.itemChangeError({
                code: 0,
                description: 'No job id specified'
            });
        }
        var onSuccess = (data) => {

            if (data) {
                if (data.item) {
                    //CATS
                    //TODO: move this parsing to the server
                    var tags = data.item.tags || {};
                    for (var cat in tags) {
                        var status = 'init';
                        var tag_type = tags[cat].type;
                        if (tag_type) {
                            if (tag_type == 'manual') {
                                status = 'manual';
                            }
                            // 'analysts_match/mismatch' relevant only when {mode=='review'}
                            else if (this.mode == 'review') {
                                if (tag_type == 'analysts_match') {
                                    status = 'manual';
                                }
                                else if (tag_type == 'analysts_mismatch') {
                                    status = 'error';
                                }
                            }
                        }
                        console.log()
                        tags[cat] = {
                            type: tag_type,
                            name: tags[cat].value,
                            status: status,
                            score: tags[cat].value ? 100 : 0
                        }
                    }
                    //ITEM
                    data.tags = tags;
                    var item = data.item;
                    var images = [];
                    var pic = item.image_url;
                    images.push(pic);
                    if (item.additional_image_urls) {
                        images = images.concat(item.additional_image_urls);
                    }
                    data.item = {
                        _id: item.rec_id,
                        title: item.title,
                        description: item.description,
                        pic: pic,
                        images: images
                    }
                }
                this.promiseTags.then(() => {
                    trigger.itemChange(this.tags, data);
                });
            } else {
                trigger.itemChangeError({
                    code: 1,
                    description: 'not a valid item'
                });
            }
        };


        sessionService.fetch({
            url: 'jobs/' + this.jobId + '/item',
            method: 'get'
        }).then(onSuccess).catch((response) => {
            return trigger.itemChangeError({
                code: 1,
                description: 'not a valid item'
            });
        });
    }



    init(jobId, userId, authToken, mode) {
        this.jobId = jobId;
        this.userId = userId;
        this.authToken = authToken;
        this.mode = mode;
        console.log(jobId, userId, authToken, mode);
        this.resolveJobId();
    }

    bind(event, callback) {
        eventTarget.addEventListener(event, callback);
    }

    unbind(event, callback) {
        eventTarget.removeEventListener(event, callback);
    }

    imagePan(domImage, sx, sy, sw, sh) {
        trigger.imagePan(domImage, sx, sy, sw, sh);
    }

    imagePanStop() {
        trigger.imagePanStop();
    }

    tagItem(itemId, tags) {
        trigger.beforeItemTagging();

        sessionService.fetch({
            url: 'jobs/' + this.jobId + '/items/' + itemId + '/tags',
            method: 'post',
            body: { tags: tags.map((tag) => ({ 'name': tag['name'], 'category': tag['category'] })) }
        }).then((response) => {
            trigger.itemTagged(itemId);
            this.getItem();
        });
    }

};


let dondeTaggerAPI = new DondeTaggerAPI();
export default dondeTaggerAPI;