class PersonController < ApplicationController

    def new_record

        @person = Person.new
        @person.height = params['height'].to_i
        @person.preference = params['preference']

        if @person.save
            render :json => { :response => 'Saved'}
        else
            render :json => { :response => 'Error'}
        end
    end

    def index
        @people = Person.all
    end

    private

        def person_params
            params
        end
end
