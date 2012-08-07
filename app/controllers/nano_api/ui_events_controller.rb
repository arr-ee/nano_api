module NanoApi
  class UiEventsController < NanoApi::ApplicationController
    def mass_create
      forward_json Client.ui_events_mass_create(params)
    end
  end
end
