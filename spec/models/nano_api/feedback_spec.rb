require 'spec_helper'

describe NanoApi::Search do

  describe '.save' do
    let(:feedback){ Fabricate :nano_api_feedback }
    let(:fake) { %r{^#{URI.join(NanoApi.config.search_server, 'user_feedback_reports')}} }

    context 'success' do
      before do
        FakeWeb.register_uri :post, fake, status: ["200", "OK"]
      end

      specify { feedback.save.should be_true }
    end

    context 'fail' do
      before do
        FakeWeb.register_uri :post, fake, status: ["422", "Unprocessible Entry"]
      end

      specify { feedback.save.should be_false }
    end
  end

end