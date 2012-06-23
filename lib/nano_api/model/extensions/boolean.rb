module NanoApi
  module Model
    module Extensions
      module Boolean
        extend ActiveSupport::Concern

        module ClassMethods
          def modelize value
            if NanoApi::Model::TRUE_VALUES.include?(value)
              true
            elsif NanoApi::Model::FALSE_VALUES.include?(value)
              false
            end
          end
        end
      end
    end
  end
end

Boolean.send :include, NanoApi::Model::Extensions::Boolean
