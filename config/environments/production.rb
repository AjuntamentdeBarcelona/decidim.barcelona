Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.cache_classes = true

  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both threaded web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Enable Rack::Cache to put a simple HTTP cache in front of your application
  # Add `rack-cache` to your Gemfile before enabling this.
  # For large-scale production use, consider using a caching reverse proxy like
  # NGINX, varnish or squid.
  # config.action_dispatch.rack_cache = true

  # Disable serving static files from the `/public` folder by default since
  # Apache or NGINX already handles this.
  config.serve_static_files = ENV['RAILS_SERVE_STATIC_FILES'].present?
  config.static_cache_control = "public, max-age=2592000"

  if !Rails.application.secrets.server_name.empty?
    config.middleware.use Rack::CanonicalHost, Rails.application.secrets.server_name
  end

  if ENV["PASSWORD"].present?
    config.middleware.use RackPassword::Block, auth_codes: [ENV["PASSWORD"]]
  end

  config.middleware.use Rack::Robots
  config.middleware.use Rack::Attack

  # Compress JavaScripts and CSS.
  config.assets.js_compressor = :uglifier
  # config.assets.css_compressor = :sass

  # Do not fallback to assets pipeline if a precompiled asset is missed.
  config.assets.compile = false

  # Asset digests allow you to set far-future HTTP expiration dates on all assets,
  # yet still be able to expire them through the digest params.
  config.assets.digest = true

  # `config.assets.precompile` and `config.assets.version` have moved to config/initializers/assets.rb

  # Specifies the header that your server uses for sending files.
  # config.action_dispatch.x_sendfile_header = 'X-Sendfile' # for Apache
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect' # for NGINX

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = !ENV["FORCE_SSL"].blank?

  # Use the lowest log level to ensure availability of diagnostic information
  # when problems arise.
  config.log_level = :debug

  # Prepend all log lines with the following tags.
  # config.log_tags = [ :subdomain, :uuid ]

  # Use a different logger for distributed setups.
  # config.logger = ActiveSupport::TaggedLogging.new(SyslogLogger.new)

  # Use a different cache store in production.
  config.cache_store = :dalli_store, { expires_in: 1.day}

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  # config.action_controller.asset_host = "https://#{Rails.application.secrets.server_name}"

  # Ignore bad email addresses and do not raise email delivery errors.
  # Set this to true and configure the email server for immediate delivery to raise delivery errors.
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.default_url_options = { host: Rails.application.secrets.server_name }
  # config.action_mailer.asset_host = "https://#{Rails.application.secrets.server_name}"

  config.action_mailer.smtp_settings = {
    :address        => Rails.application.secrets.smtp_address,
    :port           => Rails.application.secrets.smtp_port,
    :authentication => Rails.application.secrets.smtp_authentication,
    :user_name      => Rails.application.secrets.smtp_username,
    :password       => Rails.application.secrets.smtp_password,
    :domain         => Rails.application.secrets.smtp_domain,
    :enable_starttls_auto => Rails.application.secrets.smtp_starttls_auto,
    :openssl_verify_mode => 'none'
  }

  if Rails.application.secrets.sendgrid
    config.action_mailer.default_options = {
      "X-SMTPAPI" => {
        filters:  {
          clicktrack: { settings: { enable: 0 } },
          opentrack:  { settings: { enable: 0 } }
        }
      }.to_json
    }
  end

  config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins 'decidim.barcelona.cat'
      resource '/assets/*',
               :methods => [:get, :options, :head],
               :headers => :any
    end
  end


  if ENV["MEMCACHEDCLOUD_SERVERS"]
    credentials = [ENV["MEMCACHEDCLOUD_SERVERS"].split(','), { :username => ENV["MEMCACHEDCLOUD_USERNAME"], :password => ENV["MEMCACHEDCLOUD_PASSWORD"] }]
    config.cache_store = :dalli_store, *credentials

    config.action_dispatch.rack_cache = {
      :metastore    => Dalli::Client.new(*credentials),
      :allow_reload => false }
  end

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners.
  config.active_support.deprecation = :notify

  # Use default logging formatter so that PID and timestamp are not suppressed.
  config.log_formatter = ::Logger::Formatter.new

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false
end
