module NanoApi::Client::UiEvents

  def ui_events_mass_create params
    post_raw('/ui_events/mass_create', params)
  rescue RestClient::BadRequest
    nil
  end

end
