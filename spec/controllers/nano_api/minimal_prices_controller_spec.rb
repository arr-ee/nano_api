require 'spec_helper'

describe NanoApi::MinimalPricesController do
  describe 'GET week' do
    it 'should forward json, received from api minimal_prices action' do
      NanoApi::Client.any_instance.should_receive(:week_minimal_prices).with('1233', '2011-11-12', nil).and_return('{test: 1}')
      get :week, use_route: :nano_api, search_id: 1233, direct_date: Date.new(2011, 11, 12)
      response.content_type.should == Mime::JSON
      response.body.should == '{test: 1}'
    end
  end

  describe 'GET month' do
    it 'should forward json, received from api minimal_prices action' do
      NanoApi::Client.any_instance.should_receive(:month_minimal_prices).with('1233', '2011-11-01').and_return('{test: 2}')
      get :month, use_route: :nano_api, search_id: 1233, month: Date.new(2011, 11, 1)
      response.content_type.should == Mime::JSON
      response.body.should == '{test: 2}'
    end
  end
end
