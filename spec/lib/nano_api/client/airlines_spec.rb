require 'spec_helper'

describe NanoApi::Client do
  let(:rest_client){subject.send(:site)}
  let(:response){'[{"iata": "SD", "name": "Airline 1"}]'}
  before do
    FakeWeb.register_uri(:get, NanoApi.search_server + '/airlines_for_direction.json',
      body: response
    )
  end

  it 'should return list of airlines for requested direction' do
    subject.airlines_for_direction('MOW', 'LED').should == response
  end

  it 'should pass iatas from params to api call' do
    action = double
    rest_client.stub(:[]).with('airlines_for_direction.json').and_return(action)
    action.should_receive(:get).with(origin_iata: 'LED', destination_iata: 'MOW')

    subject.airlines_for_direction('LED', 'MOW')
  end
end
