FactoryGirl.define do
  factory :admin do |f|
    f.email { Faker::Internet.email }
    f.password { Faker::Internet.password }
  end
end
