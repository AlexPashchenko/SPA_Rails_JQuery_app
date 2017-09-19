FactoryGirl.define do
  factory :user do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    age { Faker::Number.between(1, 100) }
    gender ["male", "female"].sample
    country_id FactoryGirl.create(:country).id
    hobby_ids {[FactoryGirl.create(:hobby).id]}
    order_num 0
  end
end
