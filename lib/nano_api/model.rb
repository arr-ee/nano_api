require 'nano_api/model/extensions'

module NanoApi
  module Model
    class NotFound < ::StandardError
    end

    TRUE_VALUES = [true, 1, '1', 't', 'T', 'true', 'TRUE'].to_set
    FALSE_VALUES  = [false, 0, '0', 'f', 'F', 'false', 'FALSE'].to_set

    extend ActiveSupport::Concern

    included do
      include ActiveModel::Conversion
      include ActiveModel::Dirty
      include ActiveModel::Validations
      include ActiveModel::MassAssignmentSecurity
      include ActiveModel::Serialization
      include ActiveModel::Serializers::JSON
      include ActiveModel::Serializers::Xml

      include Attributable
      include Collectionizable
      include Associations
      include NestedAttributes
      include Parameterizable
      extend ActiveModel::Callbacks
      extend ActiveModel::Naming
      extend ActiveModel::Translation

      def initialize attributes = {}
        @attributes = self.class.initialize_attributes
        @new_record = true
        assign_attributes(attributes)
      end

      def self.i18n_scope
        :nano_model
      end
    end

    module ClassMethods
      def instantiate attributes
        return attributes if attributes.instance_of? self

        instance = allocate

        instance.instance_variable_set(:@attributes, initialize_attributes)
        instance.instance_variable_set(:@new_record, false)
        instance.attributes = attributes

        instance
      end
    end

    def errors
      @errors ||= ActiveModel::Errors.new(self)
    end

    def persisted?
      !@new_record
    end

    def == other
      other.instance_of?(self.class) && other.attributes == attributes
    end

  private

    def assign_attributes(attributes, options = {})
      super(sanitize_for_mass_assignment((attributes.presence || {}), options[:as]))
    end

  end
end