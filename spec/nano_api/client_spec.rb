require 'spec_helper'

describe NanoApi::Client do
  subject{NanoApi::Client}
  let(:rest_client){subject.send(:site)}
  
  describe '.search' do
    before do
      FakeWeb.register_uri(:post, NanoApi::Client::SITE + '/searches.json',
        body: '{tickets: [{test: 1}, {test: 2]}'
      )
    end

    it 'should require api for search action with given params' do
      action = double
      rest_client.stub(:[]).with('searches.json').and_return(action)
      action.should_receive(:post).with(
        search: {marker: 'test', params_attributes: {origin_iata: 'LED'}}
      )

      subject.search('test', origin_iata: 'LED')
    end

    it 'should return api response without any mutation' do
      subject.search('test', {}).should == '{tickets: [{test: 1}, {test: 2]}'
    end

    context 'handle api errors' do
      it 'should handle invalid input error' do
        FakeWeb.register_uri(:post, NanoApi::Client::SITE + '/searches.json',
          body: '{error: "params is invalid"}',
          status: ['400', 'Bad Request']
        )

        subject.search('test', {}).should == '{error: "params is invalid"}'
      end

      it 'should handle invalid input error' do
        FakeWeb.register_uri(:post, NanoApi::Client::SITE + '/searches.json',
          body: '{error: "your ip is banned"}',
          status: ['403', 'Forbidden']
        )

        subject.search('test', {}).should == '{error: "your ip is banned"}'
      end

      it 'should handle invalid input error' do
        FakeWeb.register_uri(:post, NanoApi::Client::SITE + '/searches.json',
          status: ['500', 'Internal Server Error']
        )

        subject.search('test', {}).should == nil
      end
    end
  end

  describe '.click' do
    let(:search){1122}
    let(:url){232}
    
    context 'standard api call' do
      before do
        FakeWeb.register_uri(:post, NanoApi::Client::SITE + '/searches/%d/order_urls/%d.json' % [search, url],
          body: '{"url": "http://test.com", "http_method": "post", "params": {"test_key": "test_value"}}'
        )
      end

      it 'should return parsed json' do
        NanoApi::Client.click(search, url).should == {
          url: 'http://test.com',
          http_method: 'post',
          params: {'test_key' => 'test_value'}
        }
      end
    end
    
    context 'handle api errors' do
      before do
        FakeWeb.register_uri(:post, NanoApi::Client::SITE + '/searches/%d/order_urls/%d.json' % [search, url],
          status: ['404', 'Not Found']
        )
      end

      it 'should return parsed json' do
        NanoApi::Client.click(search, url).should be_nil
      end
    end
  end

  describe '.auto_complete_places' do
    context 'standard api call' do
      before{FakeWeb.register_uri(:get, NanoApi::Client::SITE + '/places_ru.json', body: '[place1, place2]')}

      it 'should return parsed json' do
        NanoApi::Client.auto_complete_place('temp').should == '[place1, place2]'
      end
    end

    context 'handle api errors' do
      before do
        FakeWeb.register_uri(:get, NanoApi::Client::SITE + '/places_ru.json', status: ['400', 'Bad Request'])
      end

      it 'should return parsed json' do
        NanoApi::Client.auto_complete_place('temp').should be_nil
      end
    end
  end

  describe 'minimal_prices' do
    let(:search){1212}
    context 'week' do
      let(:direct_date){'date'}
      let(:return_date){'date_1'}
      before do
        FakeWeb.register_uri :get, NanoApi::Client::SITE + '/minimal_prices.json', body: '{date_1: {date2: price}}'
      end

      it 'should return json received from api call' do
        NanoApi::Client.week_minimal_prices(search, direct_date, return_date).should == '{date_1: {date2: price}}'
      end

      it 'should make api request with correct params' do
        action = double
        rest_client.stub(:[]).with('minimal_prices.json').and_return(action)
        action.should_receive(:get).with(
          search_id: search, direct_date: direct_date, return_date: return_date
        )

        subject.week_minimal_prices(search, direct_date, return_date)
      end
    end

    context 'month' do
      let(:month){'month'}
      before do
        FakeWeb.register_uri :get, NanoApi::Client::SITE + '/month_minimal_prices.json',
          body: '[price_1, price_2]'
      end

      it 'should return json received from api call' do
        NanoApi::Client.month_minimal_prices(search, month).should == '[price_1, price_2]'
      end

      it 'should make api request with correct params' do
        action = double
        rest_client.stub(:[]).with('month_minimal_prices.json').and_return(action)
        action.should_receive(:get).with(
          search_id: search, month: month
        )

        subject.month_minimal_prices(search, month)
      end
    end
  end
end
