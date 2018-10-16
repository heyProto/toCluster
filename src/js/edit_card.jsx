import React from 'react';
import { all as axiosAll, get as axiosGet, spread as axiosSpread } from 'axios';
import Card from './card.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form';

export default class editToCluster extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      dataJSON: {},
      mode: "col7",
      publishing: true,
      schemaJSON: undefined,
      fetchingData: true,
      uiSchemaJSON: {},
      refLinkDetails: undefined
    }
    this.refLinkSourcesURL = window.ref_link_sources_url
    this.toggleMode = this.toggleMode.bind(this);
    this.formValidator = this.formValidator.bind(this);
  }

  exportData() {
    let getDataObj = {
      step: this.state.step,
      dataJSON: this.state.dataJSON,
      schemaJSON: this.state.schemaJSON,
    }
    getDataObj["name"] = getDataObj.dataJSON.data.title.substr(0,225); // Reduces the name to ensure the slug does not get too long
    return getDataObj;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object.
    if (this.state.fetchingData){
      axiosAll([
        axiosGet(this.props.dataURL),
        axiosGet(this.props.schemaURL),
        axiosGet(this.props.uiSchemaURL),
        axiosGet(this.refLinkSourcesURL)
      ])
      .then(axiosSpread((card, schema, uiSchema, linkSources) => {
        let stateVars = {
          fetchingData: false,
          dataJSON: card.data,
          schemaJSON: schema.data,
          uiSchemaJSON: uiSchema.data,
          refLinkDetails: linkSources.data
        },
        links = stateVars.dataJSON.data.links;
        stateVars.dataJSON.data.published_date = stateVars.dataJSON.data.published_date || (new Date()).toISOString()

        if (links.length) {
          this.checkAndUpdateLinkInfo(links, stateVars.refLinkDetails);
        }

        this.setState(stateVars);
      }));
    }
  }

  isUrlValid(url) {
    if (!url) return false;
    var res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res == null)
      return false;
    else
      return true;
  }

  checkAndUpdateLinkInfo(links, refLinkDetails) {
    links.forEach((e,i) => {
      let linkDetails = this.lookUpLinkDetail(e.link, refLinkDetails),
        is_url_valid = this.isUrlValid(e.link);

      if (linkDetails) {
        e.favicon_url = linkDetails.favicon_url;
        e.publication_name = linkDetails.name;
      } else if (is_url_valid) {
        e.favicon_url = "https://cdn.protograph.pykih.com/lib/toCluster_default_favicon.png";
        e.publication_name = this.parseUrl(e.link).hostname;
      }
    });
  }

  lookUpLinkDetail(link, refLinkDetails) {
    refLinkDetails = refLinkDetails || this.state.refLinkDetails;

    let linkParams = this.parseUrl(link),
      lookupLink = refLinkDetails.filter((e, i) => {
        return e.url === linkParams.origin;
      })[0];

      return lookupLink;
  }

  parseUrl(url) {
    var parser = document.createElement('a'),
      search;
    parser.href = url;
    return {
      protocol: parser.protocol,
      host: parser.host,
      hostname: parser.hostname,
      port: parser.port,
      pathname: parser.pathname,
      hash: parser.hash,
      searchString: parser.search,
      origin: parser.origin
    };
  }

  onChangeHandler({formData}) {
    switch (this.state.step) {
      case 1:
        this.setState((prevStep, prop) => {
          let dataJSON = prevStep.dataJSON;
          this.checkAndUpdateLinkInfo(formData.links)
          dataJSON.data = formData;
          dataJSON.data.section = formData.title;

          return {
            dataJSON: dataJSON
          }
        })
        break;
      case 2:
        this.setState((prevState, prop) => {
          let dataJSON = prevState.dataJSON;
          if (formData.analysis && formData.analysis.length > 0) {
            dataJSON.data.analysis = formData.analysis;
          } else {
            delete dataJSON.data.analysis;
          }
          dataJSON.data.section = dataJSON.data.title;
          return {
            dataJSON: dataJSON
          }
        })
        break;
    }
  }

  onSubmitHandler({formData}) {
    switch(this.state.step) {
      case 1:
        this.setState({ step: 2 });
        break;
      case 2:
        if (typeof this.props.onPublishCallback === "function") {
          let dataJSON = this.state.dataJSON;
          dataJSON.data.section = dataJSON.data.title;
          this.setState({ publishing: true, dataJSON: dataJSON });
          let publishCallback = this.props.onPublishCallback();
          publishCallback.then((message) => {
            this.setState({ publishing: false });
          });
        }
        break;
    }
  }

  formValidator(formData, errors) {
    switch (this.state.step) {
      case 1:
        formData.links.forEach((e, i) => {
          // let details = this.lookUpLinkDetail(e.link);
          let details = this.isUrlValid(e.link);
          if (!details) {
            errors.links[i].addError("Article link is invalid");
          }
        });
        return errors;
      default:
        return errors;
    }
    return errors;
  }

  renderSEO() {
    let d = this.state.dataJSON.data,
      linksHTML = "<ul>";
    d.links.forEach(e => {
      linksHTML += `<li><a href="${e.link}" target="_blank" rel="nofollow">${e.publication_name}</a></li>`
    })
    linksHTML += "</ul>";
    let blockquote_string = `<h1>${d.title}</h1><p>${d.by_line}</p><p>${d.published_date}</p>${linksHTML}`;
    let seo_blockquote = '<blockquote>' + blockquote_string + '</blockquote>'
    return seo_blockquote;
  }

  renderSchemaJSON() {
    return this.state.schemaJSON.properties.data

  }

  renderFormData() {
    return this.state.dataJSON.data;
  }

  showLinkText() {
    return ""
  }

  showButtonText() {
    return 'Publish';
  }

  getUISchemaJSON() {
    return this.state.uiSchemaJSON.data;
  }

  onPrevHandler() {
    let prev_step = --this.state.step;
    this.setState({
      step: prev_step
    });
  }

  toggleMode(e) {
    let element = e.target.closest('a'),
      mode = element.getAttribute('data-mode');

    this.setState((prevState, props) => {
      let newMode;
      if (mode !== prevState.mode) {
        newMode = mode;
      } else {
        newMode = prevState.mode
      }

      return {
        mode: newMode
      }
    })
  }

  render() {
    if (this.state.fetchingData) {
      return(<div>Loading</div>)
    } else {
      return (
        <div className="proto-container">
          <div className="ui grid form-layout">
            <div className="row">
              <div className="four wide column proto-card-form protograph-scroll-form">
                <div>
                  <div className="section-title-text">Fill the form</div>
                  <div className="ui label proto-pull-right">
                    ToCluster
                  </div>
                </div>
                <JSONSchemaForm schema={this.renderSchemaJSON()}
                  onSubmit={((e) => this.onSubmitHandler(e))}
                  onChange={((e) => this.onChangeHandler(e))}
                  uiSchema={this.getUISchemaJSON()}
                  validate={this.formValidator}
                  formData={this.renderFormData()}>
                  <br/>
                  <button type="submit" className='default-button protograph-primary-button'>{this.showButtonText()}</button>
                </JSONSchemaForm>
              </div>

              <div className="twelve wide column proto-card-preview proto-share-card-div">
                <div className="protograph-app-holder">
                <div className="protograph-menu-container">
                  <div className="ui compact menu">
                    <a className={`item ${this.state.mode === 'col3' ? 'active' : ''}`}
                      data-mode='col3'
                      onClick={this.toggleMode}
                    >
                      col-3
                    </a>
                    <a className={`item ${this.state.mode === 'col4' ? 'active' : ''}`}
                      data-mode='col4'
                      onClick={this.toggleMode}
                    >
                      col-4
                    </a>
                    <a className={`item ${this.state.mode === 'col7' ? 'active' : ''}`}
                      data-mode='col7'
                      onClick={this.toggleMode}
                    >
                      col-7
                    </a>
                  </div>
                </div>
                  <Card
                    dataJSON={this.state.dataJSON}
                    schemaJSON={this.state.schemaJSON}
                    mode={this.state.mode}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
