import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import WatchlistItem from './watchlist_item';

class Watchlist extends React.Component {

  constructor(props) {
    super(props);

    this.watchlistItems = this.watchlistItems.bind(this);
  }

  // componentDidMount() {
    // this.props.fetchWatchlist()
    // .then(() => this.props.fetchStocks())
  // }

  watchlistItems() {
    let symbols = Object.keys(this.props.watchlist);
    let watchlist = [];
    for (let i = 0; i < symbols.length; i++) {
      let symbol = symbols[i];
      watchlist.push (
        <WatchlistItem
          className="portfolio-row"
          key={i}
          symbol={symbol}
        />
      )
    }

    return watchlist;
  }

  render() {

    return(

      <ul className="watchlist">
        <h3 id="watchlist-header" className="portfolio-header">Watchlist</h3>
        <div className="portfolio-body">
          {this.watchlistItems()}
        </div>
      </ul>
    )
  }
}

export default withRouter(Watchlist);
