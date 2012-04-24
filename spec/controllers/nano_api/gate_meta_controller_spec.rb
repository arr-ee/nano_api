require 'spec_helper'

describe NanoApi::GateMetaController do
  describe 'GET :estimated_search_duration' do
    before do
      NanoApi::Client.stub(:search_duration).and_return(23)
      get :search_duration, use_route: :nano_api, format: :json
    end

    it 'should be successful' do
      response.should be_success
      response.body.should == '23'
    end
  end
end
