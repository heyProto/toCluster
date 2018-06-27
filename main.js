import React from 'react';
import { render, hydrate } from 'react-dom';
import Card from './src/js/card.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};


ProtoGraph.Card.toCluster = function() {
    this.cardType = 'ClusterCard';
}

ProtoGraph.Card.toCluster.prototype.init = function(options) {
    this.options = options;
}

ProtoGraph.Card.toCluster.prototype.getData = function(data) {
    return this.containerInstance.exportData();
}

ProtoGraph.Card.toCluster.prototype.renderCol7 = function(data) {
    this.mode = 'col7';
    this.render();
}
ProtoGraph.Card.toCluster.prototype.renderCol4 = function(data) {
    this.mode = 'col4';
    this.render();
}
ProtoGraph.Card.toCluster.prototype.renderCol3 = function(data) {
    this.mode = 'col3';
    this.render();
}

ProtoGraph.Card.toCluster.prototype.renderScreenshot = function(data) {
    this.mode = 'screenshot';
    this.render();
}

ProtoGraph.Card.toCluster.prototype.render = function() {
    if(this.options.isFromSSR){
        hydrate(
            <Card
                mode={this.mode || "col3"}
                dataJSON={this.options.initialState.dataJSON}
            />,
            this.options.selector
        );
    } else {
        render(
            <Card
                dataURL = { this.options.data_url }
                schemaURL = { this.options.schema_url }
                siteConfigs = { this.options.site_configs }
                siteConfigURL = { this.options.site_config_url }
                mode = { this.mode || "col3"}
                ref = {
                    (e) => {
                        this.containerInstance = this.containerInstance || e;
                    }
                }
            />,
            this.options.selector
        );
    }
}