module NanoApi
  module Model
    module Extensions
      module Array
        extend ActiveSupport::Concern

        def demodelize
          join(', ')
        end

        module ClassMethods
          def modelize value
            case value
            when String then
              value.split(',').map(&:strip)
            when Array then
              value
            else
              nil
            end
          end
        end
      end
    end
  end
end

Array.send :include, NanoApi::Model::Extensions::Array
