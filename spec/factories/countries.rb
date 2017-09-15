FactoryGirl.define do
  factory :country do
    sequence(:title) { |n| Faker::Address.country + "#{n}" }
  end
end
