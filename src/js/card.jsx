import React from 'react';
import { all as axiosAll, get as axiosGet, spread as axiosSpread } from 'axios';
import TimeAgo from 'react-timeago';
import ReactMarkdown from 'react-markdown';

// className SpanRenderer extends React.Component {
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
      domain: undefined
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
      stateVar.languageTexts = this.getLanguageTexts(this.props.dataJSON.data.language);
    }

    if(this.props.domain){
      stateVar.domain = this.props.domain;
    }

    if (this.props.siteConfigs) {
      stateVar.siteConfigs = this.props.siteConfigs;
    }

    this.state = stateVar;
    //this.handleClick = this.handleClick.bind(this);
  }


  componentDidMount() {
    if (this.state.fetchingData){
      let items_to_fetch = [
        axiosGet(this.props.dataURL)
      ];
      if (this.props.siteConfigURL) {
        items_to_fetch.push(axiosGet(this.props.siteConfigURL));
      }
      axiosAll(items_to_fetch).then(axiosSpread((card, site_configs) => {
        let stateVar = {
          fetchingData: false,
          dataJSON: card.data
        };
        site_configs ? stateVar["siteConfigs"] = site_configs.data : stateVar["siteConfigs"] =  this.state.siteConfigs;
        this.setState(stateVar);
      }));
    } else {
      if (!this.props.renderingSSR) {
        this.componentDidUpdate();
      }
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
    if (this.state.dataJSON.data.summary) {
      let elem = document.querySelector('.protograph-summary-text');
      this.multiLineTruncate(elem);
    }
  }

  multiLineTruncate(el) {
    let data = this.state.dataJSON.data,
      wordArray = data.summary.split(' '),
      props = this.props;
    if (el) {
      while(el.scrollHeight > el.offsetHeight) {
        wordArray.pop();
        el.innerHTML = wordArray.join(' ') + '...' + '<br><a id="read-more-button" href="#" className="protograph-read-more">Read more</a>' ;
      }
    }
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  // checkURL(url){
  //   var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
  //   if (!re.test(url)) {
  //       return false;
  //   }
  //   return true;
  // }

  // calculateDateTime() {
  //   const data = this.state.dataJSON.data;
  //   let date_split, date_split_by_hyphen, new_date, month, time;
  //     date_split = data.data.date.split("T")[0],
  //     date_split_by_hyphen = date_split.split("-"),
  //     new_date = new Date(date_split),
  //     month = new_date.toLocaleString("en-us", { month: "short" }),
  //     time = data.data.date.split("T")[1];
  //   let is_am_pm_split = time.split(":"), am_pm;
  //   if (is_am_pm_split[0] < "12"){
  //     am_pm = "am"
  //   } else {
  //     am_pm = "pm"
  //   }

  //   return {
  //     month: month,
  //     am_pm: am_pm,
  //     date: date_split_by_hyphen,
  //     time: time
  //   }
  // }

  // ellipsizeTextBox() {
  //   let container = this.props.selector.querySelector('.tostory-card-title h1'),
  //     text = this.props.selector.querySelector('.tostory-card-title h1'),
  //     // text = document.querySelector(`.protograph-${this.props.mode}-mode .protograph-tocluster-title`),
  //     wordArray;
  //   let headline = this.state.dataJSON.data.headline;
  //   if(headline === '' || headline === undefined){
  //     text.innerHTML='';
  //   }else{
  //     // Setting the string to work with edit mode.
  //     text.innerHTML = this.state.dataJSON.data.headline;
  //     wordArray = this.state.dataJSON.data.headline.split(' ');
  //     while (container.offsetHeight > 80) {
  //       wordArray.pop();
  //       text.innerHTML = wordArray.join(' ') + '...';
  //     }
  //   }
  // }

  //handleClick(){
  //  let url = this.state.dataJSON.data.links[0].link;
  //  window.open(url,'_top');
  //}

  // matchDomain(domain, url) {
  //   let url_domain = this.getDomainFromURL(url).replace(/^(https?:\/\/)?(www\.)?/, ''),
  //     domain_has_subdomain = this.subDomain(domain),
  //     url_has_subdomain = this.subDomain(url_domain);

  //   if (domain_has_subdomain) {
  //     return (domain === url_domain) || (domain.indexOf(url_domain) >= 0);
  //   }
  //   if (url_has_subdomain) {
  //     return (domain === url_domain) || (url_domain.indexOf(domain) >= 0);
  //   }
  //   return (domain === url_domain)
  // }

  // getDomainFromURL(url) {
  //   // let a = document.createElement('a');
  //   // a.href = url;
  //   let urlComponents = parseURL(url);
  //   return urlComponents.hostname;
  // }

  // subDomain(url) {
  //   if(!url){
  //     url = "";
  //   }
  //   // IF THERE, REMOVE WHITE SPACE FROM BOTH ENDS
  //   url = url.replace(new RegExp(/^\s+/), ""); // START
  //   url = url.replace(new RegExp(/\s+$/), ""); // END

  //   // IF FOUND, CONVERT BACK SLASHES TO FORWARD SLASHES
  //   url = url.replace(new RegExp(/\\/g), "/");

  //   // IF THERE, REMOVES 'http://', 'https://' or 'ftp://' FROM THE START
  //   url = url.replace(new RegExp(/^http\:\/\/|^https\:\/\/|^ftp\:\/\//i), "");

  //   // IF THERE, REMOVES 'www.' FROM THE START OF THE STRING
  //   url = url.replace(new RegExp(/^www\./i), "");

  //   // REMOVE COMPLETE STRING FROM FIRST FORWARD SLASH ON
  //   url = url.replace(new RegExp(/\/(.*)/), "");

  //   // REMOVES '.??.??' OR '.???.??' FROM END - e.g. '.CO.UK', '.COM.AU'
  //   if (url.match(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i))) {
  //     url = url.replace(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i), "");

  //     // REMOVES '.??' or '.???' or '.????' FROM END - e.g. '.US', '.COM', '.INFO'
  //   } else if (url.match(new RegExp(/\.[a-z]{2,4}$/i))) {
  //     url = url.replace(new RegExp(/\.[a-z]{2,4}$/i), "");
  //   }

  //   // CHECK TO SEE IF THERE IS A DOT '.' LEFT IN THE STRING
  //   var subDomain = (url.match(new RegExp(/\./g))) ? true : false;

  //   return (subDomain);
  // }


  renderHTML(data) {
    if (this.state.fetchingData) {
      return (<div></div>)
    } else {
      return (<a href={this.state.dataJSON.data.links[0].link} target="_top" title={data.title}>
        <div className="pro-card toaggregation-card">
          <div className="context">
            <div className="intersection-tag">
              {data.series && <span>{data.series}</span>}
              {data.series && data.genre && <span>&#x2027;</span>}
              {data.series && data.genre &&<span>{data.genre}</span>}
            </div>
            <h1>{data.title}</h1>
            <div className="publishing-info">
              {data.by_line &&
                <div className="byline"><div className="byline-name">{data.by_line}</div></div>
              }
              <div className="timeline">{data.by_line && <span>&#x2027;</span>}<TimeAgo component="span"  date={data.published_date} /></div>
            </div>
          </div>
        </div>
      </a>)
    }
  }

  renderCol3() {
    if (this.state.fetchingData) {
      return (<div></div>)
    } else {
      let data = this.state.dataJSON.data
      return(
        <div className="pro-col-3">
          {this.renderHTML(data)}
        </div>
      )
    }
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

  render() {
    switch(this.props.mode) {
      case 'col3':
        return this.renderCol3();
      default:
        return this.renderHTML(this.state.dataJSON.data);
    }
  }

}
