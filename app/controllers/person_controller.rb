class PersonController < ApplicationController

    # show everthing
    def index
        render :json => { :response => 'ok', :people => Person.all }
    end

    # new preference
    def new
        @person = Person.new
        @person.height = params['height'].to_i
        @person.preference = params['preference']

        if @person.save
            render :json => { :response => 'ok', :person => @person }
        else
            render :json => { :response => 'error', :message => @person.errors.full_messages.join('; ') }
        end
    end

end
