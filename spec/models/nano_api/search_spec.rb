require 'spec_helper'

describe NanoApi::Search do
  let(:search){Fabricate :nano_api_search}
  subject { search }

  [:origin, :destination].each do |place|
    describe ".#{place}" do
      context do
        before{
          search.send("#{place}_name=", 'Foo')
          search.send("#{place}_iata=", 'Bar')
        }
        specify{search.send(place).should == {name: 'Foo', iata: 'Bar'}}
      end

      context do
        before{
          search.send("#{place}_name=", 'Foo')
          search.send("#{place}_iata=", nil)
        }
        specify{search.send(place).should == {name: 'Foo'}}
      end

      context do
        before{
          search.send("#{place}_name=", nil)
          search.send("#{place}_iata=", 'Bar')
        }
        specify{search.send(place).should == {name: 'Bar', iata: 'Bar'}}
      end
    end
  end

  describe '.origin=' do
    context 'hash value' do
      before{search.origin = {name: 'Foo', iata: 'Bar'}}
      specify{search.origin_name.should == 'Moscow'}
      specify{search.origin_iata.should == 'Bar'}
    end
    context 'string value' do
      before{search.origin = 'Hello'}
      specify{search.origin_name.should == 'Moscow'}
      specify{search.origin_iata.should == 'Hello'}
    end
  end

  describe '.destination=' do
    context 'hash value' do
      before{search.destination = {name: 'Foo', iata: 'Bar'}}
      specify{search.destination_name.should == 'London'}
      specify{search.destination_iata.should == 'Bar'}
    end
    context 'string value' do
      before{search.destination = 'Hello'}
      specify{search.destination_name.should == 'London'}
      specify{search.destination_iata.should == 'Hello'}
    end
  end

  describe 'names defaults' do
    let(:search) { Fabricate :nano_api_search_iatas }

    context do
      its(:origin_name){ should == search.origin_iata }
      its(:destination_name){ should == search.destination_iata }
    end

    context do
      before { search.update_attributes(origin_name: 'London', destination_name: 'Moscow') }
      its(:origin_name){ should == 'London' }
      its(:destination_name){ should == 'Moscow' }
    end
  end

  describe 'names defaults' do
    let(:search) { Fabricate :nano_api_search_iatas }

    context do
      before do
        FakeWeb.register_uri(:get,
          NanoApi.config.data_server + "/api/places?code=#{search.destination_iata}&locale=#{I18n.locale}",
          body: "[{\"_type\": \"City\", \"code\": \"#{search.destination_iata}\", \"name\": \"London1\"}]"
        )
      end

      its(:origin_name){ should == search.origin_iata }
      its(:destination_name){ should == 'London1' }
    end
  end

end
