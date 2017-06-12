Rails.application.routes.draw do

    ## main
    root to: 'application#angular'
    get '/backend' => 'application#backend'

    # posts
    post '/create_person' => 'person#new'

    # gets
    get '/people' => 'person#index'
    get '/preference' => 'person#preference'
    get '/guess' => 'person#guess'

end
