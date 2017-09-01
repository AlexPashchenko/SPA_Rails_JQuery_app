FactoryGirl.define do
  factory :country do
    title { Faker::Address.country }
  end
end
