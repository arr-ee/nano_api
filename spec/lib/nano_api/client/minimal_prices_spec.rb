require 'spec_helper'

describe NanoApi::Client do
  let(:rest_client){subject.send(:site)}
  let(:fake){ %r{^#{URI.join(NanoApi.config.search_server, path)}} }

  describe '.minimal_prices' do
    let(:search){1212}

    context 'week' do
      let(:direct_date){'date'}
      let(:return_date){'date_1'}
      let(:params){{
        search_id: search,
        direct_date: direct_date,
        return_date: return_date
      }}
      let(:path){'minimal_prices.json'}
      before do
        FakeWeb.register_uri :get, fake, body: '{date_1: {date2: price}}'
      end

      it 'should return json received from api call' do
        subject.week_minimal_prices(search, direct_date, return_date).should == '{date_1: {date2: price}}'
      end
    end

    context 'month' do
      let(:month){'month'}
      let(:params){{
        search_id: search,
        month: month
      }}
      let(:path){'month_minimal_prices.json'}
      before do
        FakeWeb.register_uri :get, fake, body: '[price_1, price_2]'
      end

      it 'should return json received from api call' do
        subject.month_minimal_prices(search, month).should == '[price_1, price_2]'
      end
    end

    context 'nearest' do
      let(:params){{
        search_id: search
      }}
      let(:path){'nearest_cities_prices.json'}
      before do
        FakeWeb.register_uri :get, fake, body: '[price_1, price_2]'
      end

      it 'should return json received from api call' do
        subject.nearest_cities_prices(search).should == '[price_1, price_2]'
      end
    end
  end
end
