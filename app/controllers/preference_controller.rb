class PreferenceController < ApplicationController

    def index

        query_height = params[:height]

        if query_height then
            preference = Preference.find_by_height(query_height)
        else
            preference = Preference.all
        end

        # render the json
        render :json => { :response => 'ok', :preference => preference }
    end

    def guess

        guess_height = params[:height].to_i

        if ( guess_height < Person::MIN_HEIGHT or guess_height > Person::MAX_HEIGHT )
            error = "We only provides guesses for heights between #{Person::MIN_HEIGHT} and #{Person::MAX_HEIGHT}"
        else

            preference = Preference.find_by_height(guess_height)

            cat_percentage = if preference then
                preference.cat
            else
                0.5
            end

            guess = guess_cat_or_dog(cat_percentage)
        end

        # render the json
        if error
            render :json => { :response => 'error', :message => error }
        else
            render :json => { :response => 'ok', :guess => guess, :cat_percentage => cat_percentage}
        end

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
