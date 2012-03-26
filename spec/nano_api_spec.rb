require 'spec_helper'

describe NanoApi do
  describe '.config' do
    it 'should read api_token from config' do
      NanoApi.api_token.should == 'test_key'
    end

    it 'should read search_server from config' do
      NanoApi.search_server.should == 'http://test.te'
    end

    it 'should read marker from config' do
      NanoApi.marker.should == 12345
    end
  end
end
