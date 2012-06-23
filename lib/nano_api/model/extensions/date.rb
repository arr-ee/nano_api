module NanoApi
  module Model
    module Extensions
      module Date
        extend ActiveSupport::Concern

        def demodelize
          to_s
        end

        module ClassMethods
          def modelize value
            parse(value.to_s) rescue nil
          end
        end
      end
    end
  end
end

Date.send :include, NanoApi::Model::Extensions::Date
