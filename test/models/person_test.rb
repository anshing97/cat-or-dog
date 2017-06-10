require 'test_helper'

class PersonTest < ActiveSupport::TestCase

    ## Testing Presense
    test "should not save with only height" do
        person = Person.new
        person.height = 1000
        assert_not person.save
    end

    test "should not save with only preference" do
        person = Person.new
        person.preference = 'cat'
        assert_not person.save
    end

    ## Testing Cat and Person value
    test "should be a cat lover" do
        person = people(:cat_lover)
        assert person.preference == 'cat'
    end

    test "should be a dog lover" do
        person = people(:dog_lover)
        assert person.preference == 'dog'
    end

    # Test arguments
    test "should only be able to assign cat and dog as preference" do
        person = Person.new
        assert person.preference = 'cat'
        assert person.preference = 'dog'
        # person.preference = 'Something' how do I assert this?
    end


end
