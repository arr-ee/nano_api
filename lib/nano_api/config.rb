module NanoApi
  class Config < ActiveSupport::HashWithIndifferentAccess
    def method_missing method
      value = self[method]
      value = self.class.new value if value.is_a? Hash
      value
    end
  end
end