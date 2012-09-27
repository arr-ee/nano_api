require 'spec_helper'

describe NanoApi::Controller::Referrerable do
  context do
    include RSpec::Rails::ControllerExampleGroup

    controller do
      include NanoApi::Controller::Referrerable

      def new
        render :nothing => true
      end
    end

    it 'should save marker in search_params' do
      get :new

      session[:current_referer].should be_blank
    end

    it 'should save marker in search_params' do
      request.stub(:referer){'http://ya.ru'}
      get :new

      session[:current_referer].should == {
        :referer => 'http://ya.ru',
        :landing_page => 'http://test.host/anonymous/new',
        :search_count => 0
      }
    end

    it 'should save marker in search_params' do
      request.stub(:referer){'http://test.com/path?param=value'}
      get :new, :foo => :bar

      session[:current_referer].should =={
        :referer => 'http://test.com/path?param=value',
        :landing_page => 'http://test.host/anonymous/new?foo=bar',
        :search_count => 0
      }
    end

    it 'should save marker in search_params' do
      request.stub(:referer){'http://test.host/path'}
      get :new

      session[:current_referer].should be_blank
    end

    it 'should save marker in search_params' do
      request.stub(:referer){'http://assets.test.host/path?hello=world'}
      get :new

      session[:current_referer].should be_blank
    end
  end
end