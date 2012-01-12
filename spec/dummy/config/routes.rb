Dummy::Application.routes.draw do
  mount NanoApi::Engine => '/nano_api'
end
