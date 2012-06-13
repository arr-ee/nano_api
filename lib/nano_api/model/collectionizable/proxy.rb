module NanoApi
  module Model
    module Collectionizable
      module Proxy
        extend ActiveSupport::Concern

        included do
          class_attribute :collectible

          def initialize source = nil
            source ||= superclass.new
            super source.map{|entity| collectible.instantiate(entity)}
          end
        end

        def respond_to? method
          super || collectible.respond_to?(method)
        end

        def method_missing method, *args, &block
          with_scope{collectible.send(method, *args, &block)}
        end

        def with_scope
          previous_scope = collectible.current_scope
          collectible.current_scope = self
          result = yield
          collectible.current_scope = previous_scope
          result
        end

        module ClassMethods
          def modelize value
            new value
          end

          def demodelize value
            []
          end
        end
      end
    end
  end
end
