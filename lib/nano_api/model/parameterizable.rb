module NanoApi
  module Model
    module Parameterizable
      extend ActiveSupport::Concern

      def to_params options = nil
        hash = serializable_hash options

        self.class.association_names.each do |association_name|
          if self.class.nested_attributes? association_name
            records = send(association_name)
            hash["#{association_name}_attributes"] = if records.is_a?(Enumerable)
              records.map { |a| a.serializable_hash }
            else
              records.serializable_hash
            end
          end
        end

        hash
      end
    end
  end
end