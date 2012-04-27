require 'spec_helper'

describe NanoApi::Client do
  let(:rest_client){subject.send(:site)}

  describe '.search' do
    context 'normal response' do
      before do
        FakeWeb.register_uri(:post, NanoApi.search_server + '/searches.json',
          body: '{tickets: [{test: 1}, {test: 2]}'
        )
      end

      it 'should require api for search action with given params' do
        action = double
        NanoApi.stub(:marker).and_return(nil)
        subject.stub(:api_client_signature).and_return('test_signature')
        rest_client.stub(:[]).with('searches.json').and_return(action)
        action.should_receive(:post).with hash_including(
          signature: 'test_signature',
          search: {host: 'test.search.te', marker: 'test', params_attributes: {origin_iata: 'LED'}}
        )

        subject.search('test.search.te', marker: 'test', origin_iata: 'LED')
      end

      it 'should return api response without any modifications' do
        subject.search('test', {}).should == '{tickets: [{test: 1}, {test: 2]}'
      end
    end

    context 'handle api errors' do
      it 'should handle invalid input error' do
        FakeWeb.register_uri(:post, NanoApi.search_server + '/searches.json',
          body: '{error: "params is invalid"}',
          status: ['400', 'Bad Request']
        )

        subject.search('test', {}).should == ['{error: "params is invalid"}', 400]
      end

      it 'should handle invalid input error' do
        FakeWeb.register_uri(:post, NanoApi.search_server + '/searches.json',
          body: '{error: "your ip is banned"}',
          status: ['403', 'Forbidden']
        )

        subject.search('test', {}).should == ['{error: "your ip is banned"}', 403]
      end

      it 'should handle invalid input error' do
        FakeWeb.register_uri(:post, NanoApi.search_server + '/searches.json',
          status: ['500', 'Internal Server Error']
        )

        subject.search('test', {}).should == nil
      end
    end
  end

  describe '.search_params' do
    before do
      FakeWeb.register_uri(:get, NanoApi.search_server + '/searches/984657.json',
        body: '{"search": {"params_attributes": {"origin": "MOW"}}}'
      )
    end

    it 'should return params of search with given id, returned from api' do
      subject.search_params(984657).should == {
        'search' =>  {'params_attributes' => {'origin' => 'MOW'}}
      }
    end
  end

  describe '.search_duration' do
    before do
      FakeWeb.register_uri(:get, NanoApi.search_server + '/estimated_search_duration.json',
        body: '{"estimated_search_duration": 23}'
      )
    end

    it 'should return estimated duration in seconds, from api call' do
      subject.search_duration.should == 23
    end
  end


  describe '.api_client_signature' do
    it 'should generate correct signature' do
      subject.send(:api_client_signature, 'test', {origin: 'MOW', destination: 'LED'}).should ==
        Digest::MD5.hexdigest('test_key:test:LED:MOW')
    end
  end

  describe '.api_client_marker' do
    it 'should add marker from config' do
      NanoApi.stub(:marker).and_return('12345')
      subject.send(:api_client_marker, 'test').should == '12345.test'
    end

    it 'should work with empty marker in config' do
      NanoApi.stub(:marker).and_return(nil)
      subject.send(:api_client_marker, 'test').should == 'test'
    end
  end
end
