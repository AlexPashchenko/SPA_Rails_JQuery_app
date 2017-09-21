# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
  Country.delete_all
  Hobby.delete_all
  User.delete_all
  Admin.delete_all
  Admin.create!(email:'123456@ukr.net', password:'12345678')
  Country.create!(title: 'Ukraine')
  Country.create!(title: 'USA')
  Country.create!(title: 'Poland')
  Country.create!(title: 'Belgium')
  Country.create!(title: 'Algeria')
  Country.create!(title: 'Britain')
  Country.create!(title: 'Belarussia')
  Country.create!(title: 'Sweden')
  Country.create!(title: 'Monaco')
  Country.create!(title: 'Turkey')
  Hobby.create!(title: 'reading')
  Hobby.create!(title: 'music')
  Hobby.create!(title: 'dancing')
  Hobby.create!(title: 'drinking')
  Hobby.create!(title: 'fishing')
  Hobby.create!(title: 'swimming')
  Hobby.create!(title: 'jumping')
  Hobby.create!(title: 'tourism')
  Hobby.create!(title: 'programming')
  Hobby.create!(title: 'cookery')
  User.create!(first_name: 'Alex', last_name: 'pashchenko', age: '21', gender: 'male', hobby_ids:[1,2,3], country_id: 3)
  User.create!(first_name: 'Dima', last_name: 'Sergienya', age: '25', gender: 'male', hobby_ids:[6,2,3], country_id: 5)
  User.create!(first_name: 'Ann', last_name: 'Pashchenko', age: '40', gender: 'male', hobby_ids:[1,4,3], country_id: 1)
