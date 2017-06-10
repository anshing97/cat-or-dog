Rails.application.routes.draw do

    get'/create_person' => 'person#new_record'
    get'/people' => 'person#index'

#     get('/person.create')
# #    resources :person
#   # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
