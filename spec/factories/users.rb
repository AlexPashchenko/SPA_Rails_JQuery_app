FactoryGirl.define do
  factory :user do |f|
    f.first_name { Faker::Name.first_name }
    f.last_name { Faker::Name.last_name }
    f.age { Faker::Number.between(1, 100) }
    f.gender ["male", "female"].sample
    f.country_id { Faker::Number.between(1, 10) }
  end
end
