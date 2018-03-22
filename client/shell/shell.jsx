import React from 'react';

import Item from "./item";
import Tagger from "./tagger";

class Shell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="shell">
                <Tagger />
                <Item />
            </div>
        )
    }
}

export default Shell;