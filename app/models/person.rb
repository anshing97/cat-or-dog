class Person < ApplicationRecord

    validates :height, presence: true
    validates :preference, presence: true

    # limit options to cat and dogs
    enum preference: [:cat, :dog]

end
