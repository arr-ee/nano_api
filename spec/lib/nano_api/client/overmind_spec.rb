require 'spec_helper'

describe NanoApi::Client do
  let(:iata) { 'LON' }
  let(:locale) { I18n.locale }
  let(:result) { '[{"_type": "City", "code":"LON", "name": "London"}]' }

  describe '#place' do
    context 'success' do
      before do
        FakeWeb.register_uri(:get,
          NanoApi.config.data_server + "/api/places?code=#{iata}&locale=#{locale}",
          body: result
        )
      end

      it 'should return result json' do
        subject.place(iata).should == result
      end
    end

    context 'fail' do
      before do
        FakeWeb.register_uri(:get,
          NanoApi.config.data_server + "/api/places?code=#{iata}&locale=#{locale}",
          status: ['404', 'Not Found']
        )
      end

      it 'should return empty array' do
        subject.place(iata).should == '[]'
      end
    end
  end
end
