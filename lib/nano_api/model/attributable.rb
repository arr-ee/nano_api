module NanoApi
  module Model
    module Attributable
      extend ActiveSupport::Concern

      included do
        class_attribute :_attributes, :instance_reader => false, :instance_writer => false
        self._attributes = ActiveSupport::HashWithIndifferentAccess.new
      end

      module ClassMethods
        def attribute name, options = {}, &block
          default = options.is_a?(Hash) ? options[:default] : options
          self._attributes = self._attributes.merge(name => (block || default))

          define_method name do
            read_attribute(name)
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
            result[name] = value.respond_to?(:call) ? value.call : value
            result
          end
        end
      end

      def read_attribute name
        @attributes[name]
      end
      alias_method :[], :read_attribute

      def write_attribute name, value
        @attributes[name] = value
      end
      alias_method :[]=, :write_attribute

      def attributes
        Hash[@attributes.map { |name, _| [name, read_attribute(name)] }]
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
