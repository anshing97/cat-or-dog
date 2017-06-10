class Person < ApplicationRecord

    # some constants
    MIN_HEIGHT = 48
    MAX_HEIGHT = 96

    # validations
    validates :height,
            presence: true,
            numericality: {
                greater_than_or_equal_to: MIN_HEIGHT,
                less_than_or_equal_to: MAX_HEIGHT
            }

    validates :preference,
            presence: true


    # limit options to cat and dogs
    enum preference: [:cat, :dog]



end
