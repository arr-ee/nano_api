require 'spec_helper'

describe NanoApi::Client do
  let(:rest_client){subject.send(:site)}

  describe '.auto_complete_places' do
    context 'standard api call' do
      before do
        I18n.locale = :ru
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
    }]}

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
      action.should_receive(:get).with(hash_including(ip: '1.1.1.1')).and_return('[]')

      subject.geoip('1.1.1.1')
    end
  end
end
