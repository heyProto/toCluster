import React from 'react';
import { all as axiosAll, get as axiosGet, spread as axiosSpread } from 'axios';
import TimeAgo from 'react-timeago';
import ReactMarkdown from 'react-markdown';

// class SpanRenderer extends React.Component {
//   constructor(props) {
//     super(props)
//   }

//   render() {
//     return(
//       <span>{JSON.stringify(this.props)}</span>
//     )
//   }
// }

export default class toCluster extends React.Component {

  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      languageTexts: undefined,
      siteConfigs: this.props.siteConfigs
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
      stateVar.languageTexts = this.getLanguageTexts(this.props.dataJSON.data.language);
    }

    if (this.props.siteConfigs) {
      stateVar.siteConfigs = this.props.siteConfigs;
    }


    this.state = stateVar;
    this.processLink = this.processLink.bind(this);
  }

  exportData() {
    return document.getElementById('protograph_div').getBoundingClientRect();
  }

  componentDidMount() {
    if (this.state.fetchingData) {
      let items_to_fetch = [
        axiosGet(this.props.dataURL)
      ];

      if (this.props.siteConfigURL) {
        items_to_fetch.push(axiosGet(this.props.siteConfigURL));
      }

      axiosAll(items_to_fetch).then(axiosSpread((card, site_configs) => {
        let stateVar = {
          fetchingData: false,
          dataJSON: card.data,
          siteConfigs: site_configs ? site_configs.data : this.state.siteConfigs
        };

        stateVar.dataJSON.data.language = stateVar.siteConfigs.primary_language.toLowerCase();
        stateVar.languageTexts = this.getLanguageTexts(stateVar.dataJSON.data.language);
        this.setState(stateVar);
      }));
    } else {
      this.componentDidUpdate();
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
    }
  }

  componentDidUpdate() {
    let data = this.state.dataJSON.data;
    setTimeout(e => {
      this.ellipsizeTextBox();
      if (data.analysis && data.analysis.length > 0) {
        this.initInteraction();
      }
    }, 150);
  }

  ellipsizeTextBox() {
    let container = document.querySelector(`.protograph-${this.props.mode}-mode .protograph-tocluster-title-container`),
      text = document.querySelector(`.protograph-${this.props.mode}-mode .protograph-tocluster-title`),
      wordArray;

    // Setting the string to work with edit mode.
    text.innerHTML = this.state.dataJSON.data.title;
    wordArray = this.state.dataJSON.data.title.split(' ');
    while (container.offsetHeight < text.offsetHeight) {
      wordArray.pop();
      text.innerHTML = wordArray.join(' ') + '...';
    }
  }

  initInteraction() {
    let aTags = document.querySelectorAll('.protograph-tocluster-analysis-container a');
    aTags.forEach((a,i) => {
      if (a.getAttribute('target') !== '_blank') {
        a.setAttribute('target', '_blank');
        a.addEventListener('mouseover', this.highlightFavicon);
        // a.addEventListener('mousemove', this.highlightFavicon());
        a.addEventListener('mouseout', this.unHightlightFavicon);
      }
    });
  }

  highlightFavicon() {
    let allFavicons = document.querySelectorAll('.protograph-tocluster-favicons .protograph-tocluster-favicon-link');
    allFavicons.forEach((e) => {
      let eHREF = e.getAttribute('href'),
          HREF = this.getAttribute('href'),
          image = e.querySelector('.protograph-tocluster-favicon');

      if (eHREF !== HREF) {
        image.classList.add('protograph-tocluster-greyscale')
      } else {
        image.classList.remove('protograph-tocluster-greyscale')
      }
    })
  }

  unHightlightFavicon() {
    let allFavicons = document.querySelectorAll('.protograph-tocluster-favicons .protograph-tocluster-favicon-link');
    allFavicons.forEach((e, i) => {
      let eHREF = e.getAttribute('href'),
        HREF = this.getAttribute('href'),
        image = e.querySelector('.protograph-tocluster-favicon');

      if (i === 0) {
        image.classList.remove('protograph-tocluster-greyscale')
      } else {
        image.classList.add('protograph-tocluster-greyscale')
      }
    })
  }

  highlightLinkInAnalysis(event) {
    let elem = event.target.closest('a.protograph-tocluster-favicon-link'),
      allFavicons = document.querySelectorAll('.protograph-tocluster-analysis-container a');
    allFavicons.forEach((e) => {
      let eHREF = e.getAttribute('href'),
        HREF = elem.getAttribute('href');

      if (eHREF !== HREF) {
        e.classList.remove('active')
      } else {
        e.classList.add('active')
      }
    })
  }

  unHighlightLinkInAnalysis(event) {
    let elem = event.target.closest('a.protograph-tocluster-favicon-link'),
      allFavicons = document.querySelectorAll('.protograph-tocluster-analysis-container a');

    allFavicons.forEach((e, i) => {
      e.classList.remove('active');
    })
  }

  getLanguageTexts(languageConfig) {
    let language = languageConfig ? languageConfig : "hindi",
      text_obj;

    switch(language.toLowerCase()) {
      case "hindi":
        text_obj = {
          font: "'Sarala', sans-serif"
        }
        break;
      default:
        text_obj = {
          font: undefined
        }
        break;
    }

    return text_obj;
  }

  renderCol7() {
    let data = this.state.dataJSON.data;
    if (this.state.fetchingData ){
      return(<div>Loading</div>)
    } else {
      if (data.analysis && data.analysis.length > 0 ) {
        return(
          <div
            id="protograph_div"
            className="protograph-col7-mode protograph-tocluster-card-with-analysis"
            style={{ fontFamily: this.state.languageTexts.font }}>
            { this.renderWithAnalysis() }
          </div>
        )
      } else {
        return (
          <div
            id="protograph_div"
            className="protograph-col7-mode protograph-tocluster-card"
            style={{ fontFamily: this.state.languageTexts.font }}>
            { this.renderCard() }
          </div>
        )
      }
    }
  }

  renderCol4() {
    if (this.state.fetchingData) {
      return (<div>Loading</div>)
    } else {
      return (
        <div
          id="protograph_div"
          className="protograph-col4-mode protograph-tocluster-card"
          style={{ fontFamily: this.state.languageTexts.font }}>
          { this.renderCard() }
        </div>
      )
    }
  }

  renderCol3() {
    if (this.state.fetchingData) {
      return (<div>Loading</div>)
    } else {
      const data = this.state.dataJSON.data,
        link = data.links[0];
      // This card code is a functional replica of renderCard() but @mojo had some design change only for the card col-3 mode hence this is coded this way.

      return (
        <div
          id="protograph_div"
          className="protograph-col3-mode"
          style={{ fontFamily: this.state.languageTexts.font }}>
            <div className="protograph-tocluster-title-container">
              <a href={link.link} target="_blank" className="protograph-tocluster-title">{data.title}</a>
            </div>
            <div className="protograph-tocluster-other-info">
              <TimeAgo component="span" className="protograph-tocluster-timeago" date={data.published_date} />
            </div>
            <div className="protograph-tocluster-favicons">
              {
                data.links.map((e, i) => {
                  let greyscale = "";
                  if (i > 0) {
                    greyscale = "protograph-tocluster-greyscale"
                  }
                  return (
                    <a key={i} href={e.link} target="_blank" className="protograph-tocluster-favicon-link">
                      <img className={`protograph-tocluster-favicon ${greyscale}`} src={e.favicon_url} />
                    </a>
                  )
                })
              }
            </div>
        </div>
      )
    }
  }

  renderCard() {
    const data = this.state.dataJSON.data,
      link = data.links[0];
    return (
      <div className="protograph-card">
        <div className="protograph-tocluster-title-container">
          <a href={link.link} target="_blank" className="protograph-tocluster-title">{data.title}</a>
        </div>

        <div className="protograph-tocluster-other-info">
          <TimeAgo component="span" className="protograph-tocluster-timeago" date={data.published_date} />
        </div>
        <div className="protograph-tocluster-favicons">
          {
            data.links.map((e, i) => {
              let greyscale = "";
              if (i > 0) {
                greyscale = "protograph-tocluster-greyscale"
              }
              return (
                <a key={i} href={e.link} target="_blank" className="protograph-tocluster-favicon-link">
                  <img className={`protograph-tocluster-favicon ${greyscale}`} src={e.favicon_url} />
                </a>
              )
            })
          }
        </div>
      </div>
    )
  }

  processLink(e) {
    const links = this.state.dataJSON.data.links;
    switch (e.type) {
      case 'linkReference':
        let linkRef = +e.identifier;
        e.type = "link";
        e.title = null;
        if ((linkRef - 1) < links.length ) {
          e.url = this.state.dataJSON.data.links[+e.identifier - 1].link;
          return true;
        } else  {
          e.type = "span"
          return true;
        }
        break;
      // Don't allow any external link. Make all the links to span.
      case 'link':
        e.type = "span"
        return true;
      default:
        return true;
    }
  }

  renderWithAnalysis() {
    const data = this.state.dataJSON.data,
      link = data.links[0];
    return (
      <div className="protograph-card protograph-card-with-analysis">
        <div className="protograph-tocluster-title-container title-with-analysis">
          <a href={link.link} target="_blank" className="protograph-tocluster-title protograph-tocluster-title-with-analysis">{data.title}</a>
        </div>
        <div className="protograph-tocluster-other-info info-with-analysis">
          <TimeAgo component="span" className="protograph-tocluster-timeago" date={data.published_date} />
        </div>
        <div className="clearfix"></div>
        <ReactMarkdown
          className="protograph-tocluster-analysis-container"
          source={data.analysis}
          allowNode={this.processLink}
          renderers={{
            span: "span"
          }}
        />
        <div className="protograph-tocluster-footer">
          <div className="protograph-tocluster-publication">{link.publication_name}</div>
          <div className="protograph-tocluster-favicons favicons-with-analysis">
            {
              data.links.map((e, i) => {
                let greyscale = "";
                if (i > 0) {
                  greyscale = "protograph-tocluster-greyscale"
                }
                return (
                  <a
                    key={i}
                    href={e.link}
                    target="_blank"
                    className="protograph-tocluster-favicon-link"
                    onMouseOver={this.highlightLinkInAnalysis}
                    onMouseOut={this.unHighlightLinkInAnalysis}
                  >
                    <img className={`protograph-tocluster-favicon ${greyscale}`} src={e.favicon_url} />
                  </a>
                )
              })
            }
          </div>
          <div className="clearfix"></div>
        </div>
      </div>
    )
  }

  render() {
    switch(this.props.mode) {
      case 'col7' :
        return this.renderCol7();
        break;
      case 'col4':
        return this.renderCol4();
        break;
      case 'col3' :
        return this.renderCol3();
        break;
    }
  }
}
