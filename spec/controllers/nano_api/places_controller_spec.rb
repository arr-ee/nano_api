require 'spec_helper'

describe NanoApi::PlacesController do
  describe 'GET index' do
    it 'should forward place json received from api call' do
      NanoApi::Client.should_receive(:auto_complete_place).with('term').and_return('[place1, place2]')

      get :index, use_route: :nano_api, term: 'term'

      response.content_type.should == Mime::JSON
      response.body.should == '[place1, place2]'
    end

    it 'should handle api errors' do
      NanoApi::Client.should_receive(:auto_complete_place)

      get :index, use_route: :nano_api, term: ''

      response.body.should be_blank
    end
  end
end
