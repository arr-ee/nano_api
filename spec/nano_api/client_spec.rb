require 'spec_helper'

describe NanoApi::Client do
  describe '.search' do
    subject{NanoApi::Client}
    let(:rest_client){subject.send(:site)}

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
end
