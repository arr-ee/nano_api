module NanoApi
  class ApplicationController < ::ApplicationController
    skip_before_filter :verify_authenticity_token
    
    protected
    
    def forward_json json
      response.content_type = Mime::JSON
      render text: json
    end
  end
end
