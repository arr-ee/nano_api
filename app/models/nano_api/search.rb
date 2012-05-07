module NanoApi
  class Search
    include NanoApi::Model

    attribute :origin_iata
    attribute :origin_name
    attribute :destination_iata
    attribute :destination_name
    attribute(:depart_date) {Date.current + 2.weeks}
    attribute(:return_date) {Date.current + 3.weeks}
    attribute :range, false
    attribute :one_way, false
    attribute :trip_class, in: (0..2), default: 0
    attribute :adults, in: (1..8), default: 1
    attribute :children, in: (0..5), default: 0
    attribute :infants, in: (0..5), default: 0

    attr_accessor :marker

    def passengers
      adults.to_i + children.to_i + infants.to_i
    end

    [:origin, :destination].each do |name|
      define_method "#{name}=" do |data|
        if data.is_a?(Hash)
          data.symbolize_keys!
          send "#{name}_name=", data[:name] if data.key?(:name)
          send "#{name}_iata=", data[:iata] if data.key?(:iata)
        end
      end
    end

    def search host
      Client.search(host, attributes)
    end

    def self.find id
      hash = Client.search_params(id)
      raise NanoApi::Model::NotFound unless hash
      new(hash)
    end

  end
end
