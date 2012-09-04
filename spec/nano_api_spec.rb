require 'spec_helper'

describe NanoApi do
  describe '.config' do
    it 'should read api_token from config' do
      NanoApi.config.api_token.should == 'test_key'
    end

    it 'should read search_server from config' do
      NanoApi.config.search_server.should == 'http://test.te'
    end

    it 'should read marker from config' do
      NanoApi.config.marker.should == 12346
    end
  end
end
