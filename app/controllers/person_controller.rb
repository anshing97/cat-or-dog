class PersonController < ApplicationController

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

    def preference

        error = nil
        value = params[:height]

        if ( value == 'all' )

            # Ben todo

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

        # render the json
        if error
            render :json => { :response => 'error', :message => error }
        else
            render :json => { :response => 'ok', :cat => cat_percentage.round(2), :dog => dog_percentage.round(2) }
        end
    end

    def guess

        error = nil
        guess = nil
        cat_percentage = nil

        guess_height = params[:height].to_i

        if ( guess_height < Person::MIN_HEIGHT or guess_height > Person::MAX_HEIGHT )
            error = "We only provides guesses for heights between #{Person::MIN_HEIGHT} and #{Person::MAX_HEIGHT}"
        else

            ppl_of_height = Person.where(height: guess_height)

            if ppl_of_height.count > 0 then

                num_cat = ppl_of_height.where(preference: 'cat').count.to_f
                num_dog = ppl_of_height.where(preference: 'dog').count.to_f

                # get a random value to compare
                cat_percentage = ( num_cat / ( num_cat + num_dog ) ).round(2)

                # figure out what our guess is
                guess = guess_cat_or_dog(cat_percentage)

            else

                # just make it 50/50
                cat_percentage = 0.5
                guess = guess_cat_or_dog(cat_percentage)

            end
        end

        # render the json
        if error
            render :json => { :response => 'error', :message => error }
        else
            render :json => { :response => 'ok', :guess => guess, :cat_percentage => cat_percentage}
        end

    end

    # show everthing
    def index
        render :json => { :response => 'ok', :people => Person.all }
    end

    private

        def guess_cat_or_dog ( cat_percentage )
            random = Random.rand

            # figure out what our guess is
            if random < cat_percentage
                'cat'
            else
                'dog'
            end
        end




end
