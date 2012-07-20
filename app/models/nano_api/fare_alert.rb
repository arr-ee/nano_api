module NanoApi
  class FareAlert
    include NanoApi::Model

    attribute :origin_code
    attribute :origin_name
    attribute :destination_code
    attribute :destination_name
    attribute :depart_date, type: Date
    attribute :return_date, type: Date
  end
end