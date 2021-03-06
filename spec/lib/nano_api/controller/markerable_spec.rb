require 'spec_helper'

describe NanoApi::Controller::Markerable do
  context do
    include RSpec::Rails::ControllerExampleGroup

    controller do
      include NanoApi::Controller::Markerable

      def new
        render :nothing => true
      end
    end

    describe '.marker' do
      [ {:marker => 'referer'}, {:ref => 'referer'} ].each do |param|
        specify do
          get :new, param
          controller.send(:marker).should == 'referer'
        end
      end
    end

    describe 'should save new marker in cookies' do
      [ {:marker => 'referer'}, {:ref => 'referer'} ].each do |param|
        specify do
          get :new, param
          controller.send(:cookies)[:marker].should == 'referer'
          response.status.should == 301
        end
      end
    end

    it 'should update cookies if new marker is affiliate marker' do
      get :new, :marker => 'test'
      get :new, :marker => '12345'

      controller.send(:cookies)[:marker].should == '12345'
    end

    it 'should update affiliate cookies if new marker is affiliate marker' do
      get :new, :marker => '12346'
      get :new, :marker => '12345'

      controller.send(:cookies)[:marker].should == '12345'
    end

    it 'should update cookies if new marker is not affiliate marker' do
      get :new, :marker => 'test'
      get :new, :marker => 'test1'

      controller.send(:cookies)[:marker].should == 'test1'
    end

    it 'should not update affiliate cookies if new marker is not affiliate marker' do
      get :new, :marker => '12345'
      get :new, :marker => 'test1'

      controller.send(:cookies)[:marker].should == '12345'
    end

    it 'should not update cookie expired time for same affiliate requests' do
      get :new, :marker => '12345'

      controller.send(:cookies).should_not_receive(:[]=).with(:marker, an_instance_of(Hash))
      get :new, :marker => '12345'
    end
  end
end