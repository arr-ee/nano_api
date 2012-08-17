require 'spec_helper'

describe NanoApi::Client do
  let(:rest_client) { NanoApi::Client.send(:site) }
  let(:fake) { %r{^#{URI.join(NanoApi.search_server, path)}} }
  let(:controller) { mock(marker: 'test', request: mock(host: 'test.com', session: {}, env: {}, remote_ip: '127.1.1.1')) }
  subject { NanoApi::Client.new controller }


  describe '.search' do
    let(:path){'searches.json'}

    context 'normal response' do
      before do
        FakeWeb.register_uri :post, fake, body: '{tickets: [{test: 1}, {test: 2]}'
      end

      it 'should require api for search action with given params' do
        subject.stub(:api_client_signature).and_return('test_signature')
        rest_client.stub(:[]).with('searches.json').and_return(subject)
        subject.should_receive(:post).with 'searches', hash_including(
          signature: 'test_signature',
          search: {
            host: 'test.com',
            marker: '12346.test',
            user_ip: '127.1.1.1',
            params_attributes: {
              origin_iata: 'LED'
            }
          }
        ), { parse: false }

        subject.search(marker: 'test', origin_iata: 'LED')
      end

      it 'should return api response without any modifications' do
        subject.search({}).should == '{tickets: [{test: 1}, {test: 2]}'
      end
    end

    context 'handle api errors' do
      it 'should handle invalid input error' do
        FakeWeb.register_uri :post, fake,
          body: '{error: "params is invalid"}',
          status: ['400', 'Bad Request']

        subject.search({}).should == ['{error: "params is invalid"}', 400]
      end

      it 'should handle invalid input error' do
        FakeWeb.register_uri(:post, NanoApi.search_server + '/searches.json',
          body: '{error: "your ip is banned"}',
          status: ['403', 'Forbidden']
        )

        subject.search({}).should == ['{error: "your ip is banned"}', 403]
      end

      it 'should handle invalid input error' do
        FakeWeb.register_uri(:post, NanoApi.search_server + '/searches.json',
          status: ['500', 'Internal Server Error']
        )

        subject.search({}).should == nil
      end
    end
  end

  describe '.search_params' do
    let(:path){'searches/984657.json'}

    before do
      FakeWeb.register_uri :get, fake, body: '{"origin": "MOW"}'
    end

    it 'should return params of search with given id, returned from api' do
      subject.search_params(984657).should == {'origin' => 'MOW', 'one_way' => true}
    end
  end

  describe '.search_duration' do
    let(:path){'estimated_search_duration.json'}

    before do
      FakeWeb.register_uri :get, fake, body: '{"estimated_search_duration": 23}'
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
