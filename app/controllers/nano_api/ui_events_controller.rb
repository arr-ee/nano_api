module NanoApi
  class UiEventsController < NanoApi::ApplicationController
    def mass_create
      forward_json NanoApi.client.ui_events_mass_create(params)
    end
  end
end
