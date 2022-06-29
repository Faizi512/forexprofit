Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: "pages#index"
  post "/submit-lead", to: "pages#submit_lead"
  get "/success", to: "pages#success"
end
