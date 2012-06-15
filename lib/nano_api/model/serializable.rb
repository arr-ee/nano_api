require 'nano_api/model/serializable/core'

module NanoApi
  module Model
    module Serializable

      class UnknownAttribute < ::StandardError
      end

      def normalize_type type
        type = type.to_s.camelize
        "NanoApi::Model::Serializable::#{type.to_s.camelize}".safe_constantize ||
          type.safe_constantize ||
          raise(UnknownAttribute.new('Unknown attribute type'))
      end

      def serialize value, type
        normalize_type(type).modelize(value)
      end

      def deserialize value, type
        normalize_type(type).demodelize(value)
      end

    end
  end
end
