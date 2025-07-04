# Represent a sum type

Let's say we have two structs in Go:

```go
type Foo struct {
  One string
}

type Bar struct {
  Two int
}
```

How do we create a sum type — a type that can hold _either one_ of our structs? Go doesn't have subtypes ([or does it?](https://journal.stuffwithstuff.com/2023/10/19/does-go-have-subtyping/)) but it does have a feature called _interfaces_.

An interface describe a set of methods that a type must implement. When a type implements all the methods, we say it _satisfies_ the interface.

The trick here is to create an interface with a single stub method (I've called it `_type` here, but that name is arbitrary). We then implement that stub method with an empty  function for each struct type:

```go
type Union interface {
  _type()
}

func (u Foo) _type() {}
func (u Bar) _type() {}
```

When we have a variable that satisfies the interface, we can switch on its underlying type:

```go
func PrintUnion(unknown Union) {
	switch thing := unknown.(type) {
	case Foo:
		// thing has type Bar in this branch
	  fmt.Printf("%s\n", thing.One)
	case Bar:
	  // thing has type Bar in this branch
	  fmt.Printf("%d\n", thing.Two)
	}
}
```

This technique was mostly cribbed from [this Zack Radisic blog post about sum types in Go](https://zackoverflow.dev/writing/hacking-go-to-give-it-sumtypes/).