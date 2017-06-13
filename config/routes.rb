Rails.application.routes.draw do

    ## main
    root to: 'application#angular'
    get '/backend' => 'application#backend'

    # posts
    post '/create_person' => 'person#new'

    # gets
    get '/people' => 'person#index'
    get '/preferences' => 'preference#index'
    get '/preference' => 'preference#find'
    get '/guess' => 'preference#guess'

end
