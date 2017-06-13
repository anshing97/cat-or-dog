require 'test_helper'

class PreferenceTest < ActiveSupport::TestCase

    ## Testing Preferences
    test "should return correct cat or dog preference" do
        cat_loving = preferences(:cat_loving)
        assert cat_loving.cat == 1.0
        assert cat_loving.dog == 0.0

        dog_loving = preferences(:dog_loving)
        assert dog_loving.cat == 0.0
        assert dog_loving.dog == 1.0

        split = preferences(:split)
        assert split.cat == 0.5
        assert split.dog == 0.5
    end

    test "should calculate preferencs correctly" do
        unused_height = 90

        # all dogs
        Person.create(:height => unused_height, :preference => 'dog')
        assert Preference.where(:height => unused_height).first.cat == 0.0

        # 1/2 prefer cats
        Person.create(:height => unused_height, :preference => 'cat')
        assert Preference.where(:height => unused_height).first.cat == 0.5

        # 2/3 prefer cats
        Person.create(:height => unused_height, :preference => 'cat')
        assert Preference.where(:height => unused_height).first.cat == 0.67

        # 2/4 prefer cats
        Person.create(:height => unused_height, :preference => 'dog')
        assert Preference.where(:height => unused_height).first.cat == 0.5

        # 2/5 prefer cats
        Person.create(:height => unused_height, :preference => 'dog')
        assert Preference.where(:height => unused_height).first.cat == 0.4

    end
end
