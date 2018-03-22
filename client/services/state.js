//this file is for sketch only

var routinesCreator = (state) => ({
    tagger: () => ({
        legend: (tag) => ({

        }),
        submit: () => {

        }
    })
})

var eventsCreator = (state, routines) => ({

})

var actionsCreator = (state, routines) => ({
    tagger: {
        form: {

            submit: () => {
                routines.tagger.submit();
            },
            categories: (category) => ({
                clear: () => {
                    category.collapse = false
                    category.value = null
                },
                tags: (tag) => ({
                    click: () => {
                        if (category.tagSelected) {
                            category.tagSelected.selected = false;
                        }
                        category.value = tag.value;
                        tag.selected = true;
                        category.tagSelected = tag;
                        category.collapse = true;
                    },
                    showLegend: () => {
                        if (state.tagger.form.highlightedTag === tag) {
                            tag.highlighted = false;
                            state.tagger.form.highlightedTag = null;
                            state.legend.show = false;
                        } else {
                            if (state.tagger.form.highlightedTag) {
                                state.tagger.form.highlightedTag.highlighted = false;
                            }
                            state.tagger.form.highlightedTag = tag;
                            tag.highlighted = true;
                            state.legend.show = true;
                            routines.tagger.legend(tag);
                        }
                    }
                })
            })
        },
        legend: {
            hide: () => {
                state.legend.show = false;
                if (state.tagger.form.highlightedTag) {
                    state.tagger.form.highlightedTag.highlighted = false;
                }
                state.refs.form.categories.highlightedTag = null;
            }
        }
    }
})

var stateCreator = ({ categories, item, status }) => ({
    refs: {
        highlightedTag: null
    },
    tagger: {
        form: {
            ready: false,
            tagHighlighted: null,
            categories: categories.map((category) => ({
                key: category.name,
                name: category.name,
                collapse: false,
                value: null,
                tagSelected: null,
                tags: category.tags.map((tag) => ({
                    key: tag.name,
                    name: tag.name,
                    value: tag.name,
                    score: tag.score,
                    legend: tag.legend,
                    selected: false,
                    highlighted: false
                }))
            })),
            blank: false
        },
        status: {
            total: status.total,
            value: status.value
        },
        legend: {
            show: false,
            header: '',
            images: ''
        }
    },
    item: {
        gallery: {
            images: item.images.map((image) => ({
                active: false,
                image: image
            }))
        },
        image: {
            image: null,
            viewport: {
                sx: 0,
                sy: 0,
                sw: 0,
                sz: 0
            }
        },
        desctription: item.desctription
    }
})

let model = {
    tagger: {
        form: {
            categories: [],
            set buttonLabel(value) {

            }
        }
    }
}

export default model;