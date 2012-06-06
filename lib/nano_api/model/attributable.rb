module NanoApi
  module Model
    module Attributable
      include Serializable
      extend ActiveSupport::Concern

      included do
        class_attribute :_attributes, :instance_reader => false, :instance_writer => false
        self._attributes = ActiveSupport::HashWithIndifferentAccess.new
      end

      module ClassMethods
        def attribute name, options = {}, &block
          default = options.is_a?(Hash) ? options[:default] : options
          type = options.is_a?(Hash) ? (options[:type].try(:to_sym) || :string) : :string
          self._attributes = self._attributes.merge(name => {
            default: (block || default),
            type: type
          })

          define_method name do
            read_attribute(name)
          end
          define_method "#{name}_before_type_cast" do
            read_attribute_before_type_cast(name)
          end
          define_method "#{name}?" do
            read_attribute(name).present?
          end
          define_method "#{name}=" do |value|
            write_attribute(name, value)
          end

          if options.is_a?(Hash) && options[:in]
            define_singleton_method "#{name}_values" do
              options[:in].dup
            end
          end
        end

        def initialize_attributes
          _attributes.inject(ActiveSupport::HashWithIndifferentAccess.new) do |result, (name, value)|
            default = value[:default]
            result[name] = default.respond_to?(:call) ? default.call : default
            result
          end
        end
      end

      def read_attribute name
        @attributes[name]
      end
      alias_method :[], :read_attribute

      def read_attribute_before_type_cast name
        type = self.class._attributes[name][:type]
        deserialize(@attributes[name], type)
      end

      def write_attribute name, value
        type = self.class._attributes[name][:type]
        @attributes[name] = serialize(value, type)
      end
      alias_method :[]=, :write_attribute

      def attributes
        Hash[attribute_names.map { |name| [name, send(name)] }]
      end

      def attribute_names
        @attributes.keys
      end

      def attributes= attributes
        assign_attributes(attributes)
      end

    private

      def assign_attributes attributes
        (attributes.presence || {}).each do |(name, value)|
          send("#{name}=", value) if respond_to?("#{name}=")
        end
        self.attributes
      end

    end
  end
end
