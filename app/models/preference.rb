class Preference < ApplicationRecord

    def self.update (height)
        pref = Preference.where(:height => height).first
        if pref.nil? then
            pref = Preference.new
            pref.height = height
        end
        total_height_people = Person.where(:height => height)
        cat_people = total_height_people.where(:preference => 'cat')
        pref.cat_preference = cat_people.count.to_f / total_height_people.count.to_f
        pref.save
    end

    def cat
        cat_preference.round(2)
    end

    def dog
        (1.0 - cat_preference).round(2)
    end

    def as_json options={}
      {
            height: height,
            cat: cat,
            dog: dog
      }
    end

end
