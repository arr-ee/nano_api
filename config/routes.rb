NanoApi::Engine.routes.draw do
  resources :searches, only: [:show, :new, :create] do
    resources :clicks, only: :show
  end
  resources :clicks, only: :new
  resources :places, only: :index
  resources :airlines, only: :index
  get 'week_minimal_prices' => 'minimal_prices#week', as: :week_minimal_prices
  get 'month_minimal_prices' => 'minimal_prices#month', as: :month_minimal_prices
  get 'estimated_search_duration' => 'gate_meta#search_duration', as: :estimated_search_duration
end
