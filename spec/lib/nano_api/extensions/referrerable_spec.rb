require 'spec_helper'

describe NanoApi::Extensions::Referrerable do
  context do
    include RSpec::Rails::ControllerExampleGroup

    controller do
      include NanoApi::Extensions::Referrerable

      def new
        render :nothing => true
      end
    end

    it 'should save marker in search_params' do
      get :new

      session[:referrer].should == nil
      session[:landing_page].should == nil
    end

    it 'should save marker in search_params' do
      request.stub(:referrer){'http://ya.ru'}
      get :new

      session[:referrer].should == 'http://ya.ru'
      session[:landing_page].should == 'http://test.host/anonymous/new'
    end

    it 'should save marker in search_params' do
      request.stub(:referrer){'http://test.com/path?param=value'}
      get :new, :foo => :bar

      session[:referrer].should == 'http://test.com/path?param=value'
      session[:landing_page].should == 'http://test.host/anonymous/new?foo=bar'
    end

    it 'should save marker in search_params' do
      request.stub(:referrer){'http://test.host/path'}
      get :new

      session[:referrer].should == nil
      session[:landing_page].should == nil
    end

    it 'should save marker in search_params' do
      request.stub(:referrer){'http://assets.test.host/path?hello=world'}
      get :new

      session[:referrer].should == nil
      session[:landing_page].should == nil
    end
  end
end