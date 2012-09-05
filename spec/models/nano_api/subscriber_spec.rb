require 'spec_helper'

describe NanoApi::Subscriber do

  describe '.save' do
    let(:subscriber){ Fabricate :nano_api_subscriber }
    let(:fake) { %r{^#{URI.join(NanoApi.config.search_server, 'subscribers')}} }

    before { FakeWeb.register_uri :post, fake, status: ["200", "OK"] }

    context do
      specify do
        RestClient::Resource.any_instance.should_receive(:post).with(hash_including(
          :signature => NanoApi::Client.signature('', subscriber.email)
        ), anything)
        subscriber.save
      end
    end
  end


end
