# encoding: UTF-8
require 'spec_helper'

describe NanoApi::Model::Associations do

  class Assoc
    include NanoApi::Model

    attribute :name
  end

  let(:klass) do
    Class.new do
      include NanoApi::Model

      attribute :name
      embeds_many :assocs
    end
  end

  let(:instance){klass.new(:name => 'world')}

  context do
    specify { instance.assocs.should be_empty }
    specify { instance.assocs.should be_instance_of Assoc::Collection }
    specify { instance.assocs.count.should == 0 }
  end

  context 'accessor' do
    before { instance.assocs = [Assoc.new(:name => 'foo'), Assoc.new(:name => 'bar')] }
    specify { instance.assocs.count.should == 2 }
    specify { instance.assocs[0].name.should == 'foo' }
    specify { instance.assocs[1].name.should == 'bar' }
  end
end
