module NanoApi
  module Global
    def search_server
      config['search_server']
    end

    def api_token
      config['api_token']
    end

    def marker
      config['marker']
    end

    def config
      @config ||= begin
        file = File.join(directory, 'config', 'nano_api.yml')
        if File.exist?(file)
          YAML.load_file(file)[env]
        else
          raise 'No nano_api config file found. Please create one using `rails g nano_api:config` command'
        end
      end
    end

    # Returns the Rails.root_to_s when you are using rails
    # Running the current directory in a generic Ruby process
    def directory
      @directory ||= defined?(Rails) ? Rails.root.to_s : Dir.pwd
    end

    def env
      @env = defined?(Rails) ? Rails.env : 'development'
    end
  end
end