import React from 'react';
import TaggerLegend from './legend';
import TaggerForm from './form';



class Tagger extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="view-tagger">
                <TaggerForm />
                <TaggerLegend />
            </div>);
    }
}

export default Tagger