Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      get "health", to: "health#show"

      namespace :auth do
        post "login", to: "sessions#create"
        post "logout", to: "sessions#destroy"
        get "me", to: "me#show"
      end

      resources :customers, only: %i[index show create]
      resources :customer_groups, only: %i[index create]
      resources :products, only: %i[index show create]
      resources :product_categories, only: %i[index]
      resources :product_units, only: %i[index]
    end
  end
end
