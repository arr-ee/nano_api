require 'spec_helper'

describe NanoApi::ClicksController do
  render_views
  
  describe 'GET new' do
    it 'should render from with params, received from api' do
      NanoApi::Client.should_receive(:click).with('111', '123').and_return(
        url: 'http://test.com',
        http_method: 'get',
        params: {test: 'test_value'}
      )
      get :new, use_route: :nano_api, search_id: 111, url_id: 123

      response.should be_success
      response.should render_template(:new)
      response.body.should have_selector('form[method=get][action="http://test.com"]')
      response.body.should have_selector('input[type=hidden][name=test][value=test_value]')
    end

    it 'should handle api errors'
  end
end
