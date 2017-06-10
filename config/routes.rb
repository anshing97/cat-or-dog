Rails.application.routes.draw do

    get'/create_person' => 'person#new'
    get'/people' => 'person#index'
    get'/preference' => 'person#preference'
    get'/guess' => 'person#guess'

end
