module NanoApi::Client::Click

  def click search_id, order_url_id, params = {}
    post('searches/%d/order_urls/%d' % [search_id, order_url_id], params).symbolize_keys
  rescue RestClient::ResourceNotFound
    nil
  end

  def link search_id, airline_id, params = {}
    get("airline_logo/#{airline_id}", params.merge(search_id: search_id), json: false).symbolize_keys
  end

  def deeplink search_id, proposal_id, params = {}
    get('airline_deeplinks/%d' % proposal_id, params.merge(search_id: search_id)).symbolize_keys
  end

end
