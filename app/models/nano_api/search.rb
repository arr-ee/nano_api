module NanoApi
  class Search
    unloadable

    include NanoApi::Model

    attribute :origin_iata
    attribute :origin_name
    attribute :destination_iata
    attribute :destination_name
    attribute(:depart_date, type: Date){Date.current + 2.weeks}
    attribute(:return_date, type: Date){Date.current + 3.weeks}
    attribute :range, type: Boolean, default: false
    attribute :one_way, type: Boolean, default: false
    attribute :trip_class, type: Integer, in: (0..2), default: 0
    attribute :adults, type: Integer, in: (1..9), default: 1
    attribute :children, type: Integer, in: (0..5), default: 0
    attribute :infants, type: Integer, in: (0..5), default: 0
    attribute :feature

    alias_method :oneway=, :one_way=

    def passengers
      [adults, children, infants].sum
    end

    [:origin, :destination].each do |name|
      define_method "#{name}=" do |data|
        if data.is_a?(Hash)
          data.symbolize_keys!
          send "#{name}_name=", data[:name] if !send("#{name}_name?") && data.key?(:name)
          send "#{name}_iata=", data[:iata] if !send("#{name}_iata?") && data.key?(:iata)
        else
          send "#{name}_name=", data
        end
      end
    end

    def return_date_for_search
      return_date unless one_way
    end

    def search options = {}
      NanoApi.client.search(attributes_for_search, options)
    end

    [:search, :cookies].each do |postfix|
      define_method "attributes_for_#{postfix}" do
        Hash[attribute_names.map do |name|
          [name, respond_to?("#{name}_for_#{postfix}") ? send("#{name}_for_#{postfix}") : send(name)]
        end]
      end
    end

    def self.find id
      attributes = NanoApi.client.search_params(id)
      raise NotFound unless attributes
      new(attributes)
    end

  end
end
