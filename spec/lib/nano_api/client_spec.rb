require 'spec_helper'

describe NanoApi::Client do
  subject{NanoApi::Client}
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
        "search" =>  {"params_attributes" => {"origin" => "MOW"}}
      }
    end
  end

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

  describe '.auto_complete_places' do
    context 'standard api call' do
      before do
        FakeWeb.register_uri(:get, NanoApi.search_server + '/places_ru.json', body: '[place1, place2]')
      end

      it 'should return parsed json' do
        subject.auto_complete_place('temp').should == '[place1, place2]'
      end
    end

    context 'handle api errors' do
      before do
        FakeWeb.register_uri(:get, NanoApi.search_server + '/places_ru.json', status: ['400', 'Bad Request'])
      end

      it 'should return parsed json' do
        subject.auto_complete_place('temp').should be_nil
      end
    end
  end

  describe '.affilate_marker?' do
    let(:affilate_markers){['12345', '12345.lo']}
    let(:non_affilate_markers){['yandex.org', '10.0.2.4', '', nil]}

    it 'should return true if marker of affiliate' do
      affilate_markers.each do |marker|
        NanoApi::Client.affilate_marker?(marker).should be_true
      end
    end

    specify 'should return false if marker is not of affiliate' do
      non_affilate_markers.each do |marker|
        NanoApi::Client.affilate_marker?(marker).should be_false
      end
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

  describe '.minimal_prices' do
    let(:search){1212}
    context 'week' do
      let(:direct_date){'date'}
      let(:return_date){'date_1'}
      before do
        FakeWeb.register_uri :get, NanoApi.search_server + '/minimal_prices.json', body: '{date_1: {date2: price}}'
      end

      it 'should return json received from api call' do
        subject.week_minimal_prices(search, direct_date, return_date).should == '{date_1: {date2: price}}'
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
        FakeWeb.register_uri :get, NanoApi.search_server + '/month_minimal_prices.json',
          body: '[price_1, price_2]'
      end

      it 'should return json received from api call' do
        subject.month_minimal_prices(search, month).should == '[price_1, price_2]'
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

  describe '.ip_to_city' do
    let(:places){[{
        iata: 'MOW',
        name: 'Moscow',
        coordinates: [15.28, 100.3],
        index_strings: ['mow'],
        airport_name: 'Domodedovo'
      }, {
        iata: 'TYL',
        name: 'Tula',
        coordinates: [16.28, 101.3],
        index_strings: ['tula'],
        airport_name: 'Tula'
      }
    ]}

    before do
      I18n.locale = :en
      FakeWeb.register_uri(:get, NanoApi.search_server + '/places/ip_to_places_en.json',
        body: places.to_json
      )
    end

    it 'should return estimated duration in seconds, from api call' do
      subject.geoip('1.1.1.1').should == {
        iata: 'MOW',
        name: 'Moscow',
        coordinates: [15.28, 100.3],
        index_strings: ['mow'],
        airport_name: 'Domodedovo'
      }
    end

    it 'should pass ip as api call param' do
      action = double
      rest_client.stub(:[]).with('places/ip_to_places_en.json').and_return(action)
      action.should_receive(:get).with(ip: '1.1.1.1').and_return('[]')

      subject.geoip('1.1.1.1')
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
