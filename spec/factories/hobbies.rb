FactoryGirl.define do
  factory :hobby do
    sequence(:title) { |n| Faker::Hipster.word + '#{n}'}
  end
end
