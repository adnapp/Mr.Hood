class Api::StocksController < ApplicationController


  def index
    @stocks = Stock.all
    render 'api/stocks/index'
  end

  def show
    @stock = Stock.find(params[:id])
    render 'api/stocks/show'
  end


  def stock_params
    params.require(:stock).permit(:symbol)
  end

  
end