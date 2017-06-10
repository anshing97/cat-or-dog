class Person < ApplicationRecord

    # limit options to cat and dogs
    enum preference: [:cat, :dog]

end
