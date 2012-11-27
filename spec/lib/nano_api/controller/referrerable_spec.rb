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

    it 'on first request referrer should be blank' do
      get :new

      session[:current_referer].should be_blank
    end

    it 'should ser proper referrer' do
      request.stub(:referer){'http://ya.ru'}
      get :new

      session[:current_referer].should == {
        :referer => 'http://ya.ru',
        :landing_page => 'http://test.host/anonymous/new',
        :search_count => 0
      }
    end

    it 'should renew referrer info' do
      request.stub(:referer){'http://test.com/path?param=value'}
      get :new, :foo => :bar

      session[:current_referer].should =={
        :referer => 'http://test.com/path?param=value',
        :landing_page => 'http://test.host/anonymous/new?foo=bar',
        :search_count => 0
      }
    end

    it 'should not save current host as referrer' do
      request.stub(:referer){'http://test.host/path'}
      get :new

      session[:current_referer].should be_blank
    end

    it 'should not save subdomains of current host as referrer' do
      request.stub(:referer){'http://assets.test.host/path?hello=world'}
      get :new

      session[:current_referer].should be_blank
    end

    it 'should be tolerant to every uri' do
      request.stub(:referer){'http://www.search-results.com/web[hello]?l=dis&q=chedapest+airfares+melbourne+to+auckland+2013&o=APN10645&apn_dtid=^BND406^YY^AU&gct=ds&apn_ptnrs=AG6&atb=sysid%3D406%3Aappid%3D341%3Auid%3D422554a4753ebdee%3Auc%3D1354000008%3Asrc%3Dffb%3Ao%3DAPN10645'}
      get :new

      session[:current_referer].should_not be_blank
    end
  end
end