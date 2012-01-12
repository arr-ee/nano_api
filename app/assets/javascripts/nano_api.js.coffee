$ ->
  console.log 'loaded'
  search_form = $ 'form[data-nano-api-search=1]'
  
  search_form.bind 'ajax:before', ->
    console.log 'Start new search'
    true

  search_form.bind 'ajax:success', (e, data) ->
    console.log "Search #{data.search_id} with #{data.tickets.length} tickets"
    for key, value of data
      console.log key
