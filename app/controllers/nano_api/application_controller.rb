module NanoApi
  class ApplicationController < ::ApplicationController
    protected
    
    def forward_json json
      response.content_type = Mime::JSON
      render text: json
    end
  end
end
