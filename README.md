# Cats or Dogs

Determine Cats and dogs preference based on height.


# API Functionality

### Create

Store height and preference
```
new_person?height=123&preference=dog
```

### Get

Get response on a guess
```
guess?height=123
```

Response:
```
{ 'preference': 'dog' }
```

---

Get preference of a height
```
preference?height=123
```
Response:
```
{
    'preference': {'cat': 0.4, 'dog': 0.6 }
}
```
---

Get preferences of all heights
```
preference?height=all
```
Response:
```
[
    { 'height': 100,  'preference': { 'cat' : 0.1, 'dog': 0.9 } },
    { 'height': 101, 'preference': { 'cat' : 0.13, 'dog': 0.87 } },
    ...
]
```

# Storing Data

*Person*
Height: number (in inches)
Preference: `dog` or `cat` (enum?)


# References

[Getting Started with Rails](http://guides.rubyonrails.org/getting_started.html)
[Learn to Build Modern Web aApps with AngularJS and Ruby on Rails](https://thinkster.io/tutorials/angular-rails)
[Installing bourbon for your rails project](https://howchoo.com/g/oti5mtcyzmj/install-bourbon-in-your-rails-project)



