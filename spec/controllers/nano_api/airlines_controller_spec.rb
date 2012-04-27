require 'spec_helper'

describe NanoApi::AirlinesController do
  describe 'GET :index' do
    before do
      NanoApi::Client.stub(:airlines_for_direction).with('LED', 'MOW').and_return('[{"iata": "UR"}]')
    end

    it 'should be successful' do
      get :index, use_route: :nano, origin: 'LED', destination: 'MOW'

      response.should be_success
      response.content_type.should == Mime::JSON
      response.body.should == '[{"iata": "UR"}]'
    end
  end
end
