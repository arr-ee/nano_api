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

      session[:referer].should == nil
      session[:landing_page].should == nil
    end

    it 'should save marker in search_params' do
      request.stub(:referer){'http://ya.ru'}
      get :new

      session[:referer].should == 'http://ya.ru'
      session[:landing_page].should == 'http://test.host/anonymous/new'
    end

    it 'should save marker in search_params' do
      request.stub(:referer){'http://test.com/path?param=value'}
      get :new, :foo => :bar

      session[:referer].should == 'http://test.com/path?param=value'
      session[:landing_page].should == 'http://test.host/anonymous/new?foo=bar'
    end

    it 'should save marker in search_params' do
      request.stub(:referer){'http://test.host/path'}
      get :new

      session[:referer].should == nil
      session[:landing_page].should == nil
    end

    it 'should save marker in search_params' do
      request.stub(:referer){'http://assets.test.host/path?hello=world'}
      get :new

      session[:referer].should == nil
      session[:landing_page].should == nil
    end
  end
end