require 'spec_helper'

describe NanoApi::SearchesController do
  describe 'GET :new' do
    let!(:geoip_data){{iata: 'MOW', name: 'Moscow'}}
    before do
      NanoApi::Client.any_instance.stub(:geoip).and_return(geoip_data)
    end

    it 'should be successful' do
      get :new, use_route: :nano_api
      response.should be_success
    end

    context 'search and cookies' do
      let(:search){{
        search: {
          origin_iata: 'LED',
          destination_iata: 'LED',
          depart_date: Date.parse('2012-04-01'),
          return_date: Date.parse('2012-04-01'),
          trip_class: 0,
          adults: 1
        }.stringify_keys!
      }}

      context do
        before{get :new, use_route: :nano_api}
        specify{assigns[:search].attributes.should include({'origin_name' => 'Moscow', 'origin_iata' => 'MOW'})}
      end

      context 'unwrapped params' do
        before{get :new, search[:search].merge(use_route: :nano_api)}
        specify{assigns[:search].attributes.should include search[:search]}
      end

      context 'wrapped params' do
        before{get :new, search.merge(use_route: :nano_api)}
        specify{assigns[:search].attributes.should include search[:search]}
      end

      context 'cookies default values' do
        let(:cookies_defaults){{
          origin_iata: 'MOW',
          destination_iata: 'LON'
        }.stringify_keys!}
        before do
          cookies.stub(:[]).with(:search_params) do
            {
              params_attributes: {
                origin: { iata: 'BKK' },
                destination: { iata: 'LON' }
              }
            }.to_json
          end
        end

        context do
          before{get :new, use_route: :nano_api}
          specify{assigns[:search].attributes.should include cookies_defaults}
        end

        context do
          before{get :new, search.merge(use_route: :nano_api)}
          specify{assigns[:search].attributes.should include search[:search]}
        end
      end
    end
  end

  describe 'GET :show' do
    let(:params){{
      search: {
        params_attributes: {
          origin_iata: 'LED',
          destination_iata: 'LED',
          depart_date: '2012-04-01',
          return_date: '2012-04-01',
          trip_class: 0,
          adults: 1
        }
      }
    }}

    before do
      NanoApi::Client.any_instance.stub(:search_params).with('1').and_return(params)
    end

    it 'should be successful' do
      get :show, id: 1, use_route: :nano_api
      response.should be_success
      response.should render_template(:new)
    end
  end

  describe 'POST :create' do
    before do
      NanoApi::Client.any_instance.stub(:search).and_return('{tickets: [{test: 1}, {test: 2}]}')
      post :create, use_route: :nano_api
    end

    it 'should be success' do
      response.content_type.should == Mime::JSON
      response.should be_success
      response.body.should == '{tickets: [{test: 1}, {test: 2}]}'
    end

    specify{cookies[:search_params].should == assigns[:search].search_params.to_json}

    it 'should pass params to api call'
    it 'should return json received from api'
  end
end
