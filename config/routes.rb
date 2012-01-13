NanoApi::Engine.routes.draw do
  resources :searches, only: [:new, :create]
  resources :clicks, only: :new
  match 'week_minimal_prices' => 'minimal_prices#week'
  match 'month_minimal_prices' => 'minimal_prices#month'
end
