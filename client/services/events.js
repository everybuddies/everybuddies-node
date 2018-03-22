import { EventTarget } from 'controls/modules.jsx';
let eventTarget = new EventTarget();

export let trigger = {
    showTagLegend: (tags, legendTag) => {
        var category = tags.find((category) => (category.name === legendTag.category));
        var tag = category.tags.find((tag) => (tag.name === legendTag.tag));
        eventTarget.createEvent('showtaglegend', {
            images: tag.examples,
            title: legendTag.tag
        });
    },
    imagePan: (domImage, sx, sy, sw, sh) => {
        eventTarget.createEvent('imagepan', {
            image: domImage,
            viewport: {
                sx, sy, sw, sh
            }
        });
    },
    imagePanStop: () => {
        eventTarget.createEvent('imagepanstop', {});
    },
    hideTagLegend: () => {
        eventTarget.createEvent('hidetaglegend');
    },
    itemChangeError: () => {
        eventTarget.createEvent('itemchangeerror');
    },
    tagsFetchError: () => {
        eventTarget.createEvent('tagsfetcherror');
    },
    errorAuth: () => {
        eventTarget.createEvent('errorauth', {});
    },
    beforeItemTagging: () => {
        eventTarget.createEvent('beforeitemtagging', {});
    },
    beforeItemChange: () => {
        eventTarget.createEvent('beforeitemchange', {});
    },
    itemTagged: (itemId) => {
        eventTarget.createEvent('itemtagged',
            {
                itemId: itemId
            });
    },
    itemChange: (tags, data) => {
        var item = data.item;
        var status = data.status;
        var status_all = data.status_all || [];
        var item_tags = data.tags;
        console.log(item_tags);
        var categories = tags.map((category) => {
            var cat_item_tag = item_tags[category.name] ? item_tags[category.name] : null;
            var cat_status = (cat_item_tag && cat_item_tag.status) ? cat_item_tag.status : 'init';
            return {
                name: category.name,
                status: cat_status,
                tags: category.tags.map((tag) => {
                    return {
                        name: tag.name,
                        category: category.name,
                        score: {
                            value: (cat_item_tag) ? cat_item_tag.score * 100 : 0,
                            manual: ((cat_status == 'manual') && (cat_item_tag.name == tag.name))
                        }
                    }
                })
            };
        });

        eventTarget.createEvent('itemchange',
            {
                item: item,
                tags: categories,
                status: status,
                status_all: status_all
            });
    }
};
export default eventTarget;