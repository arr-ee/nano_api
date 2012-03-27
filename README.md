#Nano Api Engine

Add airtickets search to your site.

##Instalation
Add the folowing line to Gemfile and then run `bundle` command.

```ruby
gem 'nano_api', :git => 'git://github.com/KosyanMedia/nano_api.git'
```

Next create api config, using generator `rails g nano_api:config`.
Provide `api_token` and `search_server` config options.

Add nano api routes in `config/routes.rb`:

```ruby
mount NanoApi::Engine => '/nano'
```

##Usage

##Customization

##Development
Fully tested pull requests are welcome.
