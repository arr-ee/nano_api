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

  it 'should call find user location by ip' do
    controller.send(:user_location).should == {iata: 'MOW'}
  end
end
