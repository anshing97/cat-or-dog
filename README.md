# Cats or Dogs

Determine Cats and dogs preference based on height.

## Todo

* Update API documentation
* Writes tests for API calls
* Writes tests for front end
* Automatically seed some data on db migration
* Refactor code
* Redo the 'thanks' page - just went with something quick right now

# API Functionality Brainstorm

(actual implementation may vary)

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
preferences
```
Response:
```
[
    { 'height': 70, 'cat' : 0.1, 'dog': 0.9 } ,
    { 'height': 71, 'cat' : 0.13, 'dog': 0.87 },
    ...
]
```

# Models

**Person**

* Height: number (in inches)
* Preference: `dog` or `cat` (enum?)

**Preference**

* Height: number (in inches)
* Cat Preference: float (a percentage of how much a heigh prefers cats)

## How it works

Person models stores out raw data, Preference stores our prediction model so that we don't have to calcualte every single time when some fetche data. Whenever someone adds a person, trigger a recalculate of the corresponding Preference.

# References

* [Getting Started with Rails](http://guides.rubyonrails.org/getting_started.html)
* [Learn to Build Modern Web aApps with AngularJS and Ruby on Rails](https://thinkster.io/tutorials/angular-rails)
* [Installing bourbon for your rails project](https://howchoo.com/g/oti5mtcyzmj/install-bourbon-in-your-rails-project)
* [Color Scheme](https://coolors.co/f4f1bb-ef626c-9bc1bc-5ca4a9-e6ebe0)
* [Angular Mousewheel Directive](http://blog.sodhanalibrary.com/2015/04/angularjs-directive-for-mouse-wheel.html#.WT2aSxPyvUI)


