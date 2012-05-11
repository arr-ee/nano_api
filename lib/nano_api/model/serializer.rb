module NanoApi
  module Model
    module Serializer
      def serialize value, type
        if respond_to? "serialize_#{type}"
          send("serialize_#{type}", value)
        else
          value
        end
      end

      def deserialize value, type
        if respond_to? "deserialize_#{type}"
          send("deserialize_#{type}", value)
        else
          value
        end
      end


      def serialize_string value
        value.try(:to_s)
      end

      def deserialize_string value
        value.try(:to_s)
      end


      def serialize_integer value
        value.try(:to_i) if value.to_s =~ /\A\d+\Z/
      end

      def deserialize_integer value
        value.try(:to_i) if value.to_s =~ /\A\d+\Z/
      end


      def serialize_boolean value
        if TRUE_VALUES.include?(value)
          true
        elsif FALSE_VALUES.include?(value)
          false
        end
      end

      def deserialize_boolean value
        if TRUE_VALUES.include?(value)
          true
        elsif FALSE_VALUES.include?(value)
          false
        end
      end
    end
  end
end