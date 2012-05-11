require 'spec_helper'

describe NanoApi::Extensions::UserLocation do
  include RSpec::Rails::ControllerExampleGroup

  controller do
    include NanoApi::Extensions::UserLocation
  end

  before do
    request.stub(:remote_ip).and_return('1.1.1.1')
    NanoApi::Client.stub(:geoip).with('1.1.1.1').and_return({iata: 'MOW'})
  end

  specify{controller.send(:user_location).should == {iata: 'MOW'}}
  specify{controller.send(:user_location_attributes).should == {origin_name: nil, origin_iata: 'MOW'}}
end
