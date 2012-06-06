module NanoApi
  module Model
    module Serializable

      class UnknownAttribute < ::StandardError
      end

      def normalize_type type
        type = type.to_s.camelize
        type.safe_constantize ||
          "NanoApi::Model::Serializable::#{type.to_s.camelize}".safe_constantize ||
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

Dir["#{File.dirname(__FILE__)}/serializable/**/*.rb"].each { |f| require f }