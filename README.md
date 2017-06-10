# Cats or Dogs

Determine Cats and dogs preference based on height.


# API Functionality

### Create

Store height and preference
```
person?height=123&preference=dog
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

Get percentage of a height
```
percentage?height=123
```
Response:
```
{
    'preference': {'cat': 0.4, 'dog': 0.6 }
}
```
---

Get percentage of all heights
```
percentage?height=all
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
Height: number
Preference: `dog` or `cat` (enum?)

