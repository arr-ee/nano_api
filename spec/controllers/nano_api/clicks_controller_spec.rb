require 'spec_helper'

describe NanoApi::ClicksController do
  render_views

  describe 'GET new' do
    context do
      it 'should render from with params, received from api' do
        NanoApi::Client.any_instance.should_receive(:click).with('111', '123', hash_including(:unique => '1')).and_return(
          url: 'http://test.com',
          http_method: 'post',
          params: {test: 'test_value'}
        )
        get :show, use_route: :nano_api, search_id: 111, id: 123

        response.should be_success
        response.body
        response.should render_template(:show)
        expect(response.body).to have_selector('form[method=post][action="http://test.com"]')
        expect(response.body).to have_selector('input[type=hidden][name=test][value=test_value]')
      end
    end

    context do
      before do
        NanoApi::Client.any_instance.stub(:click)
        get :show, use_route: :nano_api, search_id: 222, id: 234
      end

      it 'should be non-uniq click after first' do
        NanoApi::Client.any_instance.should_receive(:click).with('111', '123', hash_not_including(:unique => '1'))
        get :show, use_route: :nano_api, search_id: 111, id: 123
      end
    end

  end
end
