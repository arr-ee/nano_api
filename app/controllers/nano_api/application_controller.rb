module NanoApi
  class ApplicationController < ::ApplicationController
    skip_before_filter :verify_authenticity_token
    before_filter :setup_current_request
    unloadable

    protected

    def setup_current_request
      NanoApi::Client.current_request = request
    end

    def forward_json json, status = :ok
      response.content_type = Mime::JSON
      render text: json, status: status
    end
  end
end
