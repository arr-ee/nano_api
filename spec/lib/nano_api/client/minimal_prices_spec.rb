require 'spec_helper'

describe NanoApi::Client do
  let(:rest_client){subject.send(:site)}

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
        action.should_receive(:get).with(hash_including(
          search_id: search, direct_date: direct_date, return_date: return_date
        ))

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
        action.should_receive(:get).with(hash_including(search_id: search, month: month))

        subject.month_minimal_prices(search, month)
      end
    end
  end
end
