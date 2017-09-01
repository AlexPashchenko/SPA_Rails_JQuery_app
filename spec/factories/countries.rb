FactoryGirl.define do
  factory :country do |f|
    f.title { Faker::Address.country }
  end
end
