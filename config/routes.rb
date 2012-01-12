NanoApi::Engine.routes.draw do
  resources :searches, only: [:new, :create]
  resources :clicks, only: :new
end
