# encoding: UTF-8
require 'spec_helper'

describe NanoApi::Model::Collectionizable do
  let(:klass) do
    Class.new do
      include NanoApi::Model

      attribute :name

      def self.except_first
        collectionize(self[1..-1])
      end

      def self.no_mars
        collectionize(delete_if{|i| i.name == 'Mars'})
      end
    end
  end
  let(:collection){klass.collectionize([{:name => 'Hello'}, {:name => 'World'}, {:name => 'Mars'}])}

  specify{klass.const_defined?('Collection').should be_true}
  specify{klass.const_get('Collection').collectible.should == klass}

  specify{collection.should be_instance_of klass.collection_class}
  specify{collection.except_first.should be_instance_of klass.collection_class}
  specify{collection.no_mars.should be_instance_of klass.collection_class}
  specify{collection.except_first.should == klass.collectionize([{:name => 'World'}, {:name => 'Mars'}])}
  specify{collection.no_mars.should == klass.collectionize([{:name => 'Hello'}, {:name => 'World'}])}
  specify{collection.except_first.no_mars.should == klass.collectionize([{:name => 'World'}])}
  specify{collection.no_mars.except_first.should == klass.collectionize([{:name => 'World'}])}
end
