module NanoApi
  class Subscriber
    include NanoApi::Model

    attribute :email
    attribute :frozen_until, type: Date
    attribute :fare_alerts_attributes, type: FareAlert::Collection, default: FareAlert::Collection.new

    validates :email, :presence => true

    def fare_alerts
      fare_alerts_attributes
    end

    def save
      NanoApi::Client.send :post_raw, 'subscribers', :subscriber => present_attributes
    rescue RestClient::BadRequest
      false
    ensure
      true
    end
  end
end