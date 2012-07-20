module NanoApi
  class FeedbacksController < NanoApi::ApplicationController
    def create
      @feedback = NanoApi::Feedback.new params[:feedback].merge(:request => request)

      status = @feedback.save ? :ok : :bad_request
      render nothing: true, status: status
    end
  end
end
