require 'spec_helper'

describe NanoApi::Client do
  describe '.click' do
    let(:search){1122}
    let(:url){232}

    context 'standard api call' do
      before do
        FakeWeb.register_uri(:post, NanoApi.search_server + '/searches/%d/order_urls/%d.json' % [search, url],
          body: '{"url": "http://test.com", "http_method": "post", "params": {"test_key": "test_value"}}'
        )
      end

      it 'should return parsed json' do
        subject.click(search, url).should == {
          url: 'http://test.com',
          http_method: 'post',
          params: {'test_key' => 'test_value'}
        }
      end
    end

    context 'handle api errors' do
      before do
        FakeWeb.register_uri(:post,
          NanoApi.search_server + '/searches/%d/order_urls/%d.json' % [search, url],
          status: ['404', 'Not Found']
        )
      end

      it 'should return parsed json' do
        subject.click(search, url).should be_nil
      end
    end
  end
end
