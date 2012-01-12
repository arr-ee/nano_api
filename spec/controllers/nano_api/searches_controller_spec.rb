require 'spec_helper'

describe NanoApi::SearchesController do
  describe 'POST :create' do
    before do
      NanoApi::Client.stub(:search).and_return('{tickets: [{test: 1}, {test: 2}]}')
      post :create, :use_route => :nano_api
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
