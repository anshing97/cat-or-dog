class PersonController < ApplicationController

    def new

        @person = Person.new

        @person.height = params['height'].to_i
        @person.preference = params['preference']

        if @person.save
            render :json => { :response => 'Saved'}
        else
            render :json => { :response => 'Error'}
        end
    end

    def preference

        error = nil
        value = params[:height]

        p value

        if ( value == 'all' )


        else
            height = value.to_i

            if height < Person::MIN_HEIGHT or height > Person::MAX_HEIGHT
                error = "Height be in between #{Person::MIN_HEIGHT} and #{Person::MAX_HEIGHT}"
            else
w

            end
        end

        if error
            render :json => { :response => 'Error', :message => error }
        else
            render :json => { :cat => '0.1', :dog => '0.9' }
        end

    end

    def guess

    end

    # show everthing
    def index
        @people = Person.all
    end

end
