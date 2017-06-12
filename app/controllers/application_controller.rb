class ApplicationController < ActionController::Base

    protect_from_forgery with: :null_session


    def angular
        render 'layouts/cat-or-dog'
    end

    def backend
        render 'layouts/backend'
    end
end
