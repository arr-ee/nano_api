require 'spec_helper'

describe NanoApi::ClicksController do
  render_views

  describe 'GET show' do
    let(:form){{
      url: 'http://test.com',
      http_method: 'post',
      params: {test: 'test_value'}
    }}
    it 'should render from with params, received from api' do
      NanoApi::Client.should_receive(:click).with('111', '123').and_return(form)
      xhr :get, :show, use_route: :nano_api, search_id: 111, id: 123

      response.should be_success
      response.body
      expect(response).to render_template(:show)
      expect(response).to render_template(partial: "_form")
    end

    it 'should handle api errors'
  end
end
