module NanoApi
  class AirlinesController < NanoApi::ApplicationController
    def index
      forward_json Client.airlines_for_direction(*params.values_at(:origin, :destination))
    end
  end
end
