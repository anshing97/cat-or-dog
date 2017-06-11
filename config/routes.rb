Rails.application.routes.draw do

    root to: 'application#angular'


    # posts
    post '/create_person' => 'person#new'

    # gets
    get '/people' => 'person#index'
    get '/preference' => 'person#preference'
    get '/guess' => 'person#guess'

end
