FactoryGirl.define do
  factory :admin do |f|
    f.email { Faker::Internet.email }
    f.password { 123456 }
  end
end
