# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
Rails.application.config.assets.precompile += %w( ckeditor/* )
Rails.application.config.assets.precompile += %w( ie_lt9.js )
Rails.application.config.assets.precompile += %w( stat_graphs.js )
Rails.application.config.assets.precompile += %w( print.css )
Rails.application.config.assets.precompile += %w( i18n.js )
Rails.application.config.assets.precompile += %w( i18n/translations.js )
Rails.application.config.assets.precompile += %w( email.css )
Rails.application.config.assets.precompile += %w( ajax-loader.gif )
Rails.application.config.assets.precompile += %w( fonts/* )
Rails.application.config.assets.precompile += %w( application_split2.css )
Rails.application.config.assets.precompile += %w( bundle.js )
Rails.application.config.assets.precompile += %w( dataviz/* )
