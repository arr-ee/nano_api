require 'spec_helper'

describe NanoApi::SearchesController do
  describe 'GET :new' do
    it 'should be successful' do
      get :new, use_route: :nano_api
      response.should be_success
    end
  end

  describe 'GET :show' do
    let(:params){{
      search: {
        params_attributes: {
          origin_iata: 'LED',
          destination_iata: 'LED',
          depart_date: '2012-04-01',
          return_date: '2012-04-01',
          trip_class: 0,
          adults: 1
        }
      }
    }}

    before do
      NanoApi::Client.stub(:search_params).with(1).and_return(params.to_json)
    end

    it 'should be successful' do
      get :show, id: 1, user_route: :nano_api
      response.should be_success
      response.should render_template(:new)
    end
  end

  describe 'POST :create' do
    before do
      NanoApi::Client.stub(:search).and_return('{tickets: [{test: 1}, {test: 2}]}')
      post :create, use_route: :nano_api
    end
    
    it 'should be success' do
      response.content_type.should == Mime::JSON
      response.should be_success
      response.body.should == '{tickets: [{test: 1}, {test: 2}]}'
    end

    it 'should pass params to api call'
    it 'should return json received from api'
  end
end
