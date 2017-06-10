class PersonController < ApplicationController

    def new
        @person = Person.new
        @person.height = params['height'].to_i
        @person.preference = params['preference']

        if @person.save
            render :json => { :response => 'Saved'}
        else
            render :json => { :response => 'Error', :message => @person.errors.full_messages.join('; ') }
        end
    end

    def preference

        error = nil
        value = params[:height]

        if ( value == 'all' )



        else
            query_height = value.to_i

            if query_height < Person::MIN_HEIGHT or query_height > Person::MAX_HEIGHT
                error = "We only provides estimation for heights between #{Person::MIN_HEIGHT} and #{Person::MAX_HEIGHT}"
            else
                num_cat = Person.where(height: query_height, preference: 'dog').count.to_f
                num_dog = Person.where(height: query_height, preference: 'cat').count.to_f

                cat_percentage = num_cat / ( num_cat + num_dog )
                dog_percentage = 1.0 - cat_percentage;

            end
        end

        if error
            render :json => { :response => 'Error', :message => error }
        else
            render :json => { :cat => cat_percentage, :dog => dog_percentage }
        end

    end

    def guess

        guess_height = params[:height].to_i

        num_cat = Person.where(height: guess_height, preference: 'dog').count.to_f
        num_dog = Person.where(height: guess_height, preference: 'cat').count.to_f

        cat_percentage = num_cat / ( num_cat + num_dog )

        random = Random.rand

        guess = if random < cat_percentage
            'cat'
        else
            'dog'
        end

        render :json => {
            :guess => guess,
            :cat_percentage => cat_percentage,
            :random => random
        }

    end

    # show everthing
    def index
        @people = Person.all
    end



end
