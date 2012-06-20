require 'spec_helper'

describe NanoApi::Search do

  describe '.origin=' do
    let(:search){Fabricate :nano_api_search}

    context 'hash value' do
      before{search.origin = {name: 'Foo', iata: 'Bar'}}
      specify{search.origin_name.should == 'Moscow'}
      specify{search.origin_iata.should == 'Bar'}
    end
    context 'string value' do
      before{search.origin = 'Hello'}
      specify{search.origin_name.should == 'Hello'}
      specify{search.origin_iata.should be_nil}
    end
  end

  describe '.destination=' do
    let(:search){Fabricate :nano_api_search}

    context 'hash value' do
      before{search.destination = {name: 'Foo', iata: 'Bar'}}
      specify{search.destination_name.should == 'London'}
      specify{search.destination_iata.should == 'Bar'}
    end
    context 'string value' do
      before{search.destination = 'Hello'}
      specify{search.destination_name.should == 'Hello'}
      specify{search.destination_iata.should be_nil}
    end
  end

end