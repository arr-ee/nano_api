module NanoApi
  module Model
    module Extensions
      module NilClass
        def demodelize
          ''
        end
      end
    end
  end
end

NilClass.send :include, NanoApi::Model::Extensions::NilClass