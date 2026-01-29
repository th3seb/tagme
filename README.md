# tagme

Dating with tags

## Idea

Every profile has an id and and list of tag-groups. Groups are named (predefined) lists of tags. Tags are in theory simple key values pairs, with types and labels.

Profile example:

-   static
    -   name (text) -> "Adam"
    -   age (number:18-128) -> 24
-   About me
    -   smoke (boolean) -> false
-   preferred
    -   pref_age (range:18-128) -> 69-128
    -   pref_smoke (boolean) -> true
    -   custom (text) -> "Hello World"
    -   hobbies (extendable list of categories/strings) -> ["Music", "Music:Guitar"]

Extendable list of categories -> hobby example:

```json
[
    {
        name: "Music",
        parent: null,
        icon: "🎶",
    },
    {
        name: "Sport",
        parent: null,
        icon: "💪",
    },
    {
        name: "Guitar",
        parent: Music,
        icon: "🎸",
    },
]
```

if a category doesn't exist yet you can still write it and declare it with that
