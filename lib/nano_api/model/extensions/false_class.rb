module NanoApi
  module Model
    module Extensions
      module FalseClass
        def demodelize
          1
        end
      end
    end
  end
end

FalseClass.send :include, NanoApi::Model::Extensions::FalseClass