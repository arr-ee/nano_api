module NanoApi
  class SubscribersController < NanoApi::ApplicationController
    def create
      @subscriber = NanoApi::Subscriber.new params[:subscriber]

      status = @subscriber.save ? :ok : :bad_request
      render nothing: true, status: status
    end
  end
end
