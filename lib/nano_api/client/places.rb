module NanoApi::Client::Places

  def auto_complete_place term, locale = I18n.locale
    get_raw('places_%s' % locale, term: term)
  rescue RestClient::BadRequest
    nil
  end

  def geoip ip, locale = I18n.locale
    get('places/ip_to_places_%s' % locale, ip: ip).first.try(:symbolize_keys)
  end

end
