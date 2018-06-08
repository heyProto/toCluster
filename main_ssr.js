import React from 'react'
import { renderToString } from 'react-dom/server'
import Cluster from './src/js/card.jsx'

global.window = {}

function render(mode, initialState) {
    let content = renderToString(
        <Cluster
            dataJSON={initialState.dataJSON}
            mode={mode}
            renderingSSR={true}
        />
    );

    return { content, initialState };
}

module.exports = {
    render: render
}