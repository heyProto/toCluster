var SSR = require('./dist/0.0.1/ssr-card.min.js')
var state = {
    "dataJSON": {
        "data": {
            "section": "China to maintain communication with India on artificial lakes due to flooding concerns",
            "title": "China to maintain communication with India on artificial lakes due to flooding concerns",
            "links": [
                {
                    "link": "http://indianexpress.com/article/india/china-brahmaputra-india-4999314/",
                    "favicon_url": "http://0.gravatar.com/blavatar/efe0300e7f891c5c802ed340f6b20b67?s=32",
                    "publication_name": "TheIndianEXPRESS"
                },
                {
                    "link": "http://indianexpress.com/article/india/pm-modi-didnt-question-manmohan-singh-ansaris-commitment-to-nation-arun-jaitley-in-rajya-sabha-5001071/",
                    "favicon_url": "http://0.gravatar.com/blavatar/efe0300e7f891c5c802ed340f6b20b67?s=32",
                    "publication_name": "TheIndianEXPRESS"
                },
                {
                    "link": "http://indianexpress.com/article/india/parliament-winter-session-live-updates-congress-adjournment-motion-anantkumar-hegdes-constitution-remark-5000571/",
                    "favicon_url": "http://0.gravatar.com/blavatar/efe0300e7f891c5c802ed340f6b20b67?s=32",
                    "publication_name": "TheIndianEXPRESS"
                },
                {
                    "link": "http://indianexpress.com/article/research/anant-kumar-hegde-secularism-constitution-india-bjp-jawaharlal-nehru-indira-gandhi-5001085/",
                    "favicon_url": "http://0.gravatar.com/blavatar/efe0300e7f891c5c802ed340f6b20b67?s=32",
                    "publication_name": "TheIndianEXPRESS"
                },
                {
                    "link": "https://www.aninews.in/news/national/general-news/when-pm-suddenly-stopped-for-cup-of-coffee201712271531120001/",
                    "favicon_url": "https://aniportalimages.s3.amazonaws.com/static/img/icons/apple-icon-120x120.png",
                    "publication_name": "ANI"
                },
                {
                    "link": "https://www.aninews.in/news/business/business/four-platforms-that-will-help-you-be-party-ready-this-new-year201712271523550001/",
                    "favicon_url": "https://aniportalimages.s3.amazonaws.com/static/img/icons/apple-icon-120x120.png",
                    "publication_name": "ANI"
                }
            ],
            "analysis": "In a conversation with Indianexpress.com, [MacKinnon](https://www.googl.co.in) explained [how][2] the theory of [butterfly politics can be applied][3] to [India][4] and the [#MeToo campaign][5], [which she believes is one of the best illustrations of how butterfly interventions][6] produce social changes. She is the one."
        }
    }
}
let x = SSR.render(state)
console.log(x.content)