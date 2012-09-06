Fabricator :nano_api_search, :from => 'nano_api/search' do
  origin_name 'Moscow'
  destination_name 'London'
end

Fabricator :nano_api_search_iatas, :from => 'nano_api/search' do
  origin_iata 'MOW'
  destination_iata 'LON'
end
