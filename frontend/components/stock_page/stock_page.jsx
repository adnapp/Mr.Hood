import React    from 'react';
import { Link, withRouter } from 'react-router-dom';
import StockSidebar from './stock_sidebar/stock_sidebar';
import StockChart from '../charts/stock_chart/stock_chart_container';
import StockCard from '../stock_card/stock_card';
import { SyncLoader } from 'halogenium';
import SearchBar from '../navbar/search/search_container';
import TradeForm from './stock_sidebar/trade_form';
import WatchlistButton from './watchlist_button_container';
import { currencyFormatter } from '../../util/formatter';

class StockPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refresh: null,
    };

    this.updatePrice = this.updatePrice.bind(this);
    this.stockNews = this.stockNews.bind(this);
    this.peers = this.peers.bind(this);
  }


  componentDidMount() {
    this.props.fetchStock(this.props.match.params.symbol)
      .then(() => this.props.fetchStocks())
      .then(() => this.props.fetchPrice(this.props.match.params.symbol))
      .then(() => this.props.fetchStats(this.props.match.params.symbol))
      .then(() => this.props.fetchCompany(this.props.match.params.symbol))
      .then(() => this.props.fetchPeers(this.props.match.params.symbol))
      .then(() => this.props.fetchNews(this.props.match.params.symbol))
      .then(() => this.props.fetchWatchlist())
      .then(() => this.props.fetchTopStocks())
      .then(() => {
        const refresh = setInterval(this.updatePrice, 5000);
        this.setState({
          refresh: refresh,
          loading: false
        });
      }
    )
  }


  updatePrice() {
    const currentPrice = this.props.stock.price;
    this.props.fetchPrice(this.props.stock.symbol).then(
      newPrice => {
        if (currentPrice !== newPrice) {
          this.props.stock.price = newPrice
        }
      }
    )
  }

  componentWillReceiveProps(nextProps) {
    if ( nextProps.stock && (nextProps.match.params.symbol !== this.props.match.params.symbol.toUpperCase())) {
      this.setState({ loading: true },
      () => this.props.fetchStock(nextProps.match.params.symbol)
      .then(() => this.props.fetchPrice(nextProps.match.params.symbol))
      .then(() => this.props.fetchStats(nextProps.match.params.symbol))
      .then(() => this.props.fetchPeers(nextProps.match.params.symbol))
      .then(() => this.props.fetchCompany(nextProps.match.params.symbol))
      .then(() => this.props.fetchNews(nextProps.match.params.symbol))
      .then(() => this.setState({loading: false})));
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.refresh);
  }


  stockNews() {
    let news = [];
    for (let i = 0; i < this.props.news.length; i++) {
      let article = this.props.news[i];
      news.push(
        <li className="article-container stock-page" key={i}>
          <div className="article-text stock-page">
            <div className="article-source">{article.source}</div>
            <div className="article-title"><a href={article.url}>{article.headline}</a></div>
            <div className="article-body">{article.summary}</div>
          </div>
        </li>
      )
    }

    return news;
  }

  peers() {
    let peers = [];
    for (let i = 0; i < this.props.peers.length; i++) {
      let peer = this.props.peers[i];
      peers.push(
        <StockCard
          symbol={peer}
          key={i}
        />
      )
    }

    return peers;
  }

  render() {

    if (this.state.loading) {
      return (
        <div className="loading-icon">
          <SyncLoader
            size="20px"
            color="#21ce99"
          />
        </div>
      )

    } else {


      return (
        <div className="stock-page">

        <section className="main-container">
          <div className="main-stock-section">
              <StockChart
                key={this.props.match.params.symbol}
                stock={this.props.stock}
                price={this.props.price}
                stats={this.props.stats}
              />
            <div className="about-container">
              <div id="about-title">About</div>
              <div id="about-body">{this.props.companyData.description}</div>
              <ul className="stats-ul">
                <div className='stats-row'>
                  <li className="stat-container">
                    <div className="stat-title">CEO</div>
                    <div className="stat-body">{this.props.companyData.CEO}</div>
                  </li>
                  <li className="stat-container">
                    <div className="stat-title">Exchange</div>
                    <div className="stat-body">{this.props.companyData.exchange}</div>
                  </li>
                  <li className="stat-container">
                    <div className="stat-title">Sector</div>
                    <div className="stat-body">{this.props.companyData.sector}</div>
                  </li>
                  <li className="stat-container">
                    <div className="stat-title">Symbol</div>
                    <div className="stat-body">{this.props.companyData.symbol}</div>
                  </li>
                </div>
                <div className='stats-row'>
                  <li className="stat-container">
                    <div className="stat-title">Market Cap</div>
                    <div className="stat-body">{currencyFormatter.format(this.props.stats.marketcap)}</div>
                  </li>
                  <li className="stat-container">
                    <div className="stat-title">Revenue</div>
                    <div className="stat-body">{currencyFormatter.format(this.props.stats.revenue)}</div>
                  </li>
                  <li className="stat-container">
                    <div className="stat-title">52w High</div>
                    <div className="stat-body">{currencyFormatter.format(this.props.stats.week52high)}</div>
                  </li>
                  <li className="stat-container">
                    <div className="stat-title">52w Low</div>
                    <div className="stat-body">{currencyFormatter.format(this.props.stats.week52low)}</div>
                  </li>
                </div>
              </ul>
            </div>
            <div className="peers-container">
              <div id="peers-title">Peers</div>
              <span className="peers-ul">
                {this.peers()}
              </span>
            </div>
            <div className='news-container'>
                <div id="news-title">Latest News</div>
                <ul>
                  {this.stockNews()}
                </ul>
            </div>

          </div>
            <div className="side">
              <StockSidebar
                key={this.props.match.params.symbol}
                stock={this.props.stock}
                price={this.props.price}
              />

              <div className="watchlist-button-wrapper">
                <WatchlistButton
                  stock={this.props.stock}
                  watchlist={this.props.watchlist}
                />
              </div>
            </div>

          </section>
        </div>
      )
    }

  }

}

export default withRouter(StockPage);

// UNAVAILABLE:
// TLRY
