NanoApi::Engine.routes.draw do
  resources :searches, only: [:new, :create]
  resources :clicks, only: :new
  resources :places, only: :index
  match 'week_minimal_prices' => 'minimal_prices#week', as: :week_minimal_prices
  match 'month_minimal_prices' => 'minimal_prices#month', as: :month_minimal_prices
end
