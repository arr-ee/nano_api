require 'spec_helper'

describe NanoApi::Client do
  let(:rest_client){subject.send(:site)}
  let(:response){'{success: true}'}
  let(:fake){ URI.join(NanoApi.search_server, path) }
  let(:path){'/ui_events/mass_create.json'}

  before do
    FakeWeb.register_uri :post, fake, body: response
  end

  it 'should return list of airlines for requested direction' do
    subject.ui_events_mass_create({hello: 'world'}).should == response
  end
end
