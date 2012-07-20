module NanoApi
  class FareAlert
    include NanoApi::Model

    attribute :origin_hash, type: Hash
    attribute :destination_hash, type: Hash
    attribute :depart_date, type: Date
    attribute :return_date, type: Date
  end
end