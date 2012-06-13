module NanoApi
  module Model
    module Collectionizable
      extend ActiveSupport::Concern

      included do
        collection = Class.new(Array) do
          include NanoApi::Model::Collectionizable::Proxy
        end
        collection.collectible = self

        const_set :Collection, collection
      end

      module ClassMethods

        def respond_to? method
          super || collection_class.superclass.method_defined?(method)
        end

        def method_missing method, *args, &block
          current_scope.send(method, *args, &block) if collection_class.superclass.method_defined?(method)
        end

        def collectionize source
          collection_class.new(source)
        end

        def collection_class
          const_get :Collection
        end

        def source= source
          @source = source
        end

        def source
          @source || []
        end

        def current_scope= value
          @current_scope = value
        end

        def current_scope
          @current_scope ||= collectionize(source)
        end
        alias :scope :current_scope

      end
    end
  end
end
