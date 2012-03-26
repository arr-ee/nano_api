module NanoApi
  class ConfigGenerator < Rails::Generators::Base
    source_root File.expand_path('../templates', __FILE__)
    desc 'This generator create config file for nano_api gem'

    def generate_config_file
      copy_file 'config.yml', 'config/nano_api.yml'
    end
  end
end
