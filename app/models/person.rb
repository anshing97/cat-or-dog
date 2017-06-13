class Person < ApplicationRecord

    after_save :calculate_preference

    # some constants
    MIN_HEIGHT = 48
    MAX_HEIGHT = 96

    # validations
    validates :height,
            presence: true,
            numericality: {
                greater_than_or_equal_to: MIN_HEIGHT,
                less_than_or_equal_to: MAX_HEIGHT,
                message: "must be in between #{Person::MIN_HEIGHT} and #{Person::MAX_HEIGHT}"
            }

    # limit options to cat and dogs
    enum preference: [:cat, :dog]

    # tried to write a validation here, but somehow because i'm using enums it doesn't work
    # just validate it on the api call
    validates :preference,
            presence: true

    def as_json options={}
      {
            height: height,
            preference: preference
      }
    end

    private

        def calculate_preference
            Preference.update(self.height)
        end

end
