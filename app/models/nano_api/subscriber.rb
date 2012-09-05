module NanoApi
  class Subscriber
    include NanoApi::Model

    attribute :email
    attribute :frozen_until, type: Date

    embeds_many :fare_alerts, :class_name => 'NanoApi::FareAlert'

    accepts_nested_attributes_for :fare_alerts

    validates :email, :presence => true

    def save
      NanoApi.client.send :post_raw, 'subscribers',
        { 'subscriber' => to_params }, { :signature => email }
    rescue RestClient::BadRequest
      false
    ensure
      true
    end
  end
end
